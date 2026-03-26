import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

// Camera capture requires react-native-vision-camera which needs native linking.
// This is a placeholder/stub that shows a camera button and calls onCapture
// when pressed — meant to be wired up to a real camera screen via navigation action.

export interface CameraCaptureWidgetProps {
  mode?: 'document' | 'selfie' | 'barcode';
  overlayShape?: 'rectangle' | 'circle' | 'none';
  overlayHint?: string;
  onCapture?: () => void;
}

const MODE_ICON: Record<string, string> = {
  document: '📄',
  selfie: '🤳',
  barcode: '▦',
};

export const CameraCaptureWidget: React.FC<CameraCaptureWidgetProps> = ({
  mode = 'document',
  overlayHint,
  onCapture,
}) => {
  const hint =
    overlayHint ??
    (mode === 'document'
      ? 'Position your document within the frame'
      : mode === 'selfie'
      ? 'Align your face with the circle'
      : 'Point camera at barcode');

  return (
    <TouchableOpacity style={styles.container} onPress={onCapture} activeOpacity={0.8}>
      <Text style={styles.icon}>{MODE_ICON[mode]}</Text>
      <Text style={styles.title}>Take {mode === 'selfie' ? 'Selfie' : mode === 'barcode' ? 'Scan' : 'Photo'}</Text>
      <Text style={styles.hint}>{hint}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  icon: { fontSize: 48 },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  hint: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
