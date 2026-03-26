import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export interface ImagePreviewWidgetProps {
  label?: string;
  uri?: string; // base64 or file URI
}

export const ImagePreviewWidget: React.FC<ImagePreviewWidgetProps> = ({ label, uri }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      {uri ? (
        <Image
          source={{ uri }}
          style={styles.image}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>No image</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  placeholder: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  placeholderText: { fontSize: 14, color: '#9CA3AF' },
});
