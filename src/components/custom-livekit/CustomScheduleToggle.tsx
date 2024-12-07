import * as React from 'react';
import { CustomWidgetState } from '../../types/types';
import { useTabToggle } from '../../hooks/useTabToggle';

interface CustomScheduleToggleProps extends React.HTMLAttributes<HTMLButtonElement> {
  onScheduleToggle?: () => void;
  scheduleState?: CustomWidgetState;
}

export function CustomScheduleToggle({ 
  onScheduleToggle,
  scheduleState,
  children 
}: CustomScheduleToggleProps) {
  const { mergedProps } = useTabToggle({
    props: {},
    onToggle: () => onScheduleToggle?.(),
    isActive: scheduleState?.showSchedule ?? false,
    tabType: 'schedule'
  });

  return (
    <button {...mergedProps as React.ButtonHTMLAttributes<HTMLButtonElement>}>
      {children}
    </button>
  );
} 