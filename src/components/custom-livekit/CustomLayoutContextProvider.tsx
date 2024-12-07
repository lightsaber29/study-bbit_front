import { LayoutContextProvider } from '@livekit/components-react';
import { CustomLayoutContextProviderProps } from '../../types/livekit-extends';

export function CustomLayoutContextProvider({ 
  children, 
  ...props 
}: CustomLayoutContextProviderProps) {
  return (
    <LayoutContextProvider {...props as any}>
      {children}
    </LayoutContextProvider>
  );
} 