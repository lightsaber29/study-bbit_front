import * as React from 'react';
import { useTabToggle } from '../../hooks/useTabToggle';
import { CustomWidgetState } from '../../types/types';

interface CustomChatToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onChatToggle?: () => void;
  chatState?: CustomWidgetState;
}

export function CustomChatToggle({ 
  onChatToggle,
  chatState,
  children 
}: CustomChatToggleProps) {
  const { mergedProps } = useTabToggle({
    props: {},
    onToggle: () => onChatToggle?.(),
    isActive: chatState?.showChat ?? false,
    tabType: 'chat'
  });

  return (
    <button {...mergedProps as React.ButtonHTMLAttributes<HTMLButtonElement>}>
      {children}
    </button>
  );
} 