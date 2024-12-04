import { useLayoutContext } from '@livekit/components-react';
import * as React from 'react';

export interface UseScheduleToggleProps {
  props: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

export function useScheduleToggle({ props }: UseScheduleToggleProps) {
  const { dispatch, state } = useLayoutContext().widget;

  const mergedProps = React.useMemo(() => {
    return {
      ...props,
      className: `lk-button ${props.className || ''}`,
      onClick: () => {
        if (dispatch) dispatch({ msg: 'toggle_schedule' });
      },
      'aria-pressed': state?.showSchedule ? 'true' : 'false',
    };
  }, [props, dispatch, state]);

  return { mergedProps };
} 