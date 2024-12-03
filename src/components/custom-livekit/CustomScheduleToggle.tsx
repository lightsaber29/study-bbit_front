import * as React from 'react';
import { mergeProps } from './custom-addon/utils';
import { ScheduleAction } from '../../types/types';

export interface CustomScheduleToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  onScheduleToggle?: React.Dispatch<ScheduleAction>;
}

export function CustomScheduleToggle({ children, onScheduleToggle, ...props }: CustomScheduleToggleProps) {
  const buttonProps = React.useMemo(() => {
    return mergeProps(props, {
      className: 'lk-button',
      onClick: () => {
        onScheduleToggle?.({ type: 'TOGGLE_SCHEDULE' });
      },
    });
  }, [onScheduleToggle, props]);

  return <button {...buttonProps}>{children}</button>;
} 