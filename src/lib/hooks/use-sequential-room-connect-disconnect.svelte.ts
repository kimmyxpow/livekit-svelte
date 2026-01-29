import { Mutex, type Room } from 'livekit-client';
import { log } from '@livekit/components-core';

const CONNECT_DISCONNECT_WARNING_THRESHOLD_QUANTITY = 2;
const CONNECT_DISCONNECT_WARNING_THRESHOLD_MS = 400;

const ROOM_CHANGE_WARNING_THRESHOLD_QUANTITY = 3;
const ROOM_CHANGE_WARNING_THRESHOLD_MS = 1000;

/** @public */
export type UseSequentialRoomConnectDisconnectResults<R extends Room | undefined> = {
	connect: typeof Room.prototype.connect & (R extends undefined ? null : unknown);
	disconnect: typeof Room.prototype.disconnect & (R extends undefined ? null : unknown);
};

type ConnectDisconnectQueueItem =
	| {
			type: 'connect';
			room: Room;
			args: Parameters<typeof Room.prototype.connect>;
			resolve: (value: Awaited<ReturnType<typeof Room.prototype.connect>>) => void;
			reject: (err: Error) => void;
	  }
	| {
			type: 'disconnect';
			room: Room;
			args: Parameters<typeof Room.prototype.disconnect>;
			resolve: (value: Awaited<ReturnType<typeof Room.prototype.disconnect>>) => void;
			reject: (err: Error) => void;
	  };

/**
 * When calling room.disconnect() as part of a Svelte effect cleanup function, it is possible for
 * a room.connect(...) in the effect body to start running while the room.disconnect() is still
 * running. This hook sequentializes these two operations, so they always happen in order and
 * never overlap.
 *
 * @example
 * ```svelte
 * const { connect, disconnect } = useSequentialRoomConnectDisconnect(room);
 *
 * // Connecting to a room:
 * $effect(() => {
 *   connect();
 *   return () => disconnect();
 * });
 * ```
 *
 * @public
 */
export function useSequentialRoomConnectDisconnect<R extends Room | undefined>(
	room: R
): UseSequentialRoomConnectDisconnectResults<R> {
	let connectDisconnectQueue: ConnectDisconnectQueueItem[] = $state([]);
	const processConnectsAndDisconnectsLock = new Mutex();

	// Process room connection / disconnection events and execute them in series
	const processConnectsAndDisconnects = async () => {
		return processConnectsAndDisconnectsLock.lock().then(async (unlock) => {
			while (true) {
				const message = connectDisconnectQueue.pop();
				if (!message) {
					unlock();
					break;
				}

				switch (message.type) {
					case 'connect':
						await message.room
							.connect(...message.args)
							.then(message.resolve)
							.catch(message.reject);
						break;
					case 'disconnect':
						await message.room
							.disconnect(...message.args)
							.then(message.resolve)
							.catch(message.reject);
						break;
				}
			}
		});
	};

	let roomChangedTimes: Date[] = $state([]);
	const checkRoomThreshold = (now: Date) => {
		let roomChangesInThreshold = 0;
		roomChangedTimes = roomChangedTimes.filter((i) => {
			const isWithinThreshold = now.getTime() - i.getTime() < ROOM_CHANGE_WARNING_THRESHOLD_MS;
			if (isWithinThreshold) {
				roomChangesInThreshold += 1;
			}
			return isWithinThreshold;
		});

		if (roomChangesInThreshold > ROOM_CHANGE_WARNING_THRESHOLD_QUANTITY) {
			log.warn(
				`useSequentialRoomConnectDisconnect: room changed reference rapidly (over ${ROOM_CHANGE_WARNING_THRESHOLD_QUANTITY}x in ${ROOM_CHANGE_WARNING_THRESHOLD_MS}ms). This is not recommended.`
			);
		}
	};

	// When the room changes, clear any pending connect / disconnect calls and log when it happened
	$effect(() => {
		connectDisconnectQueue = [];

		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const now = new Date();
		roomChangedTimes.push(now);
		checkRoomThreshold(now);
	});

	let connectDisconnectEnqueueTimes: Date[] = [];
	const checkConnectDisconnectThreshold = (now: Date) => {
		let connectDisconnectsInThreshold = 0;
		connectDisconnectEnqueueTimes = connectDisconnectEnqueueTimes.filter((i) => {
			const isWithinThreshold =
				now.getTime() - i.getTime() < CONNECT_DISCONNECT_WARNING_THRESHOLD_MS;
			if (isWithinThreshold) {
				connectDisconnectsInThreshold += 1;
			}
			return isWithinThreshold;
		});

		if (connectDisconnectsInThreshold > CONNECT_DISCONNECT_WARNING_THRESHOLD_QUANTITY) {
			log.warn(
				`useSequentialRoomConnectDisconnect: room connect / disconnect occurring in rapid sequence (over ${CONNECT_DISCONNECT_WARNING_THRESHOLD_QUANTITY}x in ${CONNECT_DISCONNECT_WARNING_THRESHOLD_MS}ms). This is not recommended and may be the sign of a bug like a useEffect dependency changing every render.`
			);
		}
	};

	const connect = async (...args: Parameters<typeof Room.prototype.connect>) => {
		return new Promise((resolve, reject) => {
			if (!room) {
				throw new Error('Called connect(), but room was unset');
			}
			// eslint-disable-next-line svelte/prefer-svelte-reactivity
			const now = new Date();
			checkConnectDisconnectThreshold(now);
			connectDisconnectQueue.push({ type: 'connect', room, args, resolve, reject });
			connectDisconnectEnqueueTimes.push(now);
			processConnectsAndDisconnects();
		});
	};

	const disconnect = async (...args: Parameters<typeof Room.prototype.disconnect>) => {
		return new Promise((resolve, reject) => {
			if (!room) {
				throw new Error('Called disconnect(), but room was unset');
			}
			// eslint-disable-next-line svelte/prefer-svelte-reactivity
			const now = new Date();
			checkConnectDisconnectThreshold(now);
			connectDisconnectQueue.push({ type: 'disconnect', room, args, resolve, reject });
			connectDisconnectEnqueueTimes.push(now);
			processConnectsAndDisconnects();
		});
	};

	return {
		connect: room ? connect : (null as unknown as typeof connect),
		disconnect: room ? disconnect : (null as unknown as typeof disconnect)
	} as UseSequentialRoomConnectDisconnectResults<R>;
}
