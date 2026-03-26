import React from 'react';
import { StyleSheet, Text } from 'react-native';

export interface TextWidgetProps {
  text: string;
  variant?: 'title' | 'body' | 'caption' | 'label';
}

export const TextWidget: React.FC<TextWidgetProps> = ({ text, variant = 'body' }) => {
  return <Text style={styles[variant]}>{text}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  body: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 4,
  },
  caption: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
});
