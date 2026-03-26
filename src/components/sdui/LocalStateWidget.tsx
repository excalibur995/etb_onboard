import React from 'react';

/**
 * Non-visual component that declares local UI state.
 * In a real implementation, this would register a key/value into a shared
 * local state context scoped to the current screen. For now it's a no-op
 * component that silently passes through.
 */

export interface LocalStateWidgetProps {
  stateKey: string;
  initial?: string;
  allowedStates?: Record<string, any>;
}

export const LocalStateWidget: React.FC<LocalStateWidgetProps> = () => {
  return null; // Non-visual
};
