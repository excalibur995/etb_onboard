import React from 'react';
import { StyleSheet, View } from 'react-native';

import { NavigateActionPayload } from '../../types/api';
import { evaluateVisibility } from '../../utils/sdui/evaluateVisibility';
import { getComponent } from '../registry/ComponentRegistry';

export type DynamicZoneRendererProps = {
  blocks: any[];
  journeyId: string;
  onNavigate: (payload: NavigateActionPayload) => void;
  isExecuting?: boolean;
};

export const DynamicBlock: React.FC<{
  block: any;
  journeyId: string;
  onNavigate: (payload: NavigateActionPayload) => void;
  isExecuting?: boolean;
}> = ({ block, journeyId, onNavigate, isExecuting }) => {
  if (!evaluateVisibility(block.visibility, journeyId)) return null;

  const Component = getComponent(block.__component);

  if (!Component) return null;

  return <Component {...block} journeyId={journeyId} onNavigate={onNavigate} isExecuting={isExecuting} />;
};

export const DynamicZoneRenderer: React.FC<DynamicZoneRendererProps> = ({
  blocks,
  journeyId,
  onNavigate,
  isExecuting,
}) => {
  if (!blocks?.length) return null;

  return (
    <View style={styles.container}>
      {blocks.map((block, index) => (
        <DynamicBlock
          key={`${block.__component}-${block.id ?? index}`}
          block={block}
          journeyId={journeyId}
          onNavigate={onNavigate}
          isExecuting={isExecuting}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
});
