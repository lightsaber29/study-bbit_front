import { LayoutContextProviderProps as LiveKitLayoutContextProviderProps } from '@livekit/components-react';
import { CustomWidgetState } from './types';

export interface CustomLayoutContextProviderProps extends Omit<LiveKitLayoutContextProviderProps, 'onWidgetChange'> {
  onWidgetChange?: (state: CustomWidgetState) => void;
  children?: React.ReactNode;
} 