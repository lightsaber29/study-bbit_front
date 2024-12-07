import * as React from 'react';
import { CustomWidgetState } from '../../types/types';
import { useTabToggle } from '../../hooks/useTabToggle';

interface CustomMeetingMinutesToggleProps extends React.HTMLAttributes<HTMLButtonElement> {
  onMinutesToggle?: () => void;
  scheduleState?: CustomWidgetState;
}

export function CustomMeetingMinutesToggle({ 
  onMinutesToggle,
  scheduleState,
  children 
}: CustomMeetingMinutesToggleProps) {
  const { mergedProps } = useTabToggle({
    props: {},
    onToggle: () => onMinutesToggle?.(),
    isActive: scheduleState?.showMeetingMinutes ?? false,
    tabType: 'minutes'
  });

  return (
    <button {...mergedProps as React.ButtonHTMLAttributes<HTMLButtonElement>}>
      {children}
    </button>
  );
} 