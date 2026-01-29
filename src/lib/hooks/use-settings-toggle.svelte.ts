import { getLayoutContext } from '../context/layout-context.svelte.js';
import { mergeProps } from '../utils.js';

/** @alpha */
export interface UseSettingsToggleProps {
	props: Record<string, unknown>;
}

/**
 * The `useSettingsToggle` hook provides state and functions for toggling the settings menu.
 * @remarks
 * Depends on the `LayoutContext` to work properly.
 * @see {@link SettingsMenu}
 * @alpha
 */
export function useSettingsToggle({ props }: UseSettingsToggleProps) {
	const layoutContext = getLayoutContext();
	const widget = layoutContext?.widget;
	const dispatch = widget?.dispatch;
	const className = 'lk-button lk-settings-toggle';

	const mergedProps = mergeProps(props as Record<string, unknown>, {
		className,
		onclick: () => {
			if (dispatch) dispatch({ msg: 'toggle_settings' });
		},
		'aria-pressed': false
	});

	return { mergedProps };
}
