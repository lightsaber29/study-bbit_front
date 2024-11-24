import * as React from 'react';
import { useSettingsToggle } from './custom-addon/useSettingsToggle.ts';

/** @alpha */
export interface CustomSettingsMenuToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * The `SettingsMenuToggle` component is a button that toggles the visibility of the `SettingsMenu` component.
 * @remarks
 * For the component to have any effect it has to live inside a `LayoutContext` context.
 *
 * @alpha
 */
export const CustomSettingsMenuToggle: (
  props: CustomSettingsMenuToggleProps & React.RefAttributes<HTMLButtonElement>,
) => React.ReactNode = /* @__PURE__ */ React.forwardRef<HTMLButtonElement, CustomSettingsMenuToggleProps>(
  function CustomSettingsMenuToggle(props: CustomSettingsMenuToggleProps, ref) {
    const { mergedProps } = useSettingsToggle({ props });

    return (
      <button ref={ref} {...mergedProps}>
        {props.children}
      </button>
    );
  },
);
