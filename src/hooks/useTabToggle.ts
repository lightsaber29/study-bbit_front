import * as React from 'react';

export type TabAction = {
  type: 'TOGGLE_CHAT' | 'TOGGLE_SCHEDULE' | 'TOGGLE_SETTINGS' | 'TOGGLE_MINUTES';
};

export interface UseTabToggleProps {
  props: React.ButtonHTMLAttributes<HTMLButtonElement>;
  onToggle?: React.Dispatch<TabAction>;
  isActive?: boolean;
  tabType: 'chat' | 'schedule' | 'settings' | 'minutes';
}

export function useTabToggle({ props, onToggle, isActive, tabType }: UseTabToggleProps) {
  const handleClick = React.useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const actionType = `TOGGLE_${tabType.toUpperCase()}` as TabAction['type'];
      onToggle?.({ type: actionType });
    },
    [onToggle, tabType]
  );

  const mergedProps = React.useMemo(() => {
    return {
      ...props,
      className: `lk-button ${isActive ? 'lk-button-active' : ''} ${props.className || ''}`.trim(),
      onClick: handleClick,
      'aria-pressed': isActive ? 'true' : 'false',
    };
  }, [props, handleClick, isActive]);

  return { mergedProps };
} 