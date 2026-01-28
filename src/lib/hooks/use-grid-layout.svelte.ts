import type { GridLayoutDefinition, GridLayoutInfo } from '@livekit/components-core';
import { selectGridLayout, GRID_LAYOUTS } from '@livekit/components-core';

export interface UseGridLayoutOptions {
	participantCount: number;
	width: number;
	height: number;
	layouts?: GridLayoutDefinition[];
}

export function useGridLayout(options: UseGridLayoutOptions): GridLayoutInfo {
	const { participantCount, width, height, layouts = GRID_LAYOUTS } = options;
	return selectGridLayout(layouts, participantCount, width, height);
}
