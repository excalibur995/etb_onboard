import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface BadgeWidgetProps {
  label: string;
  variant?: 'success' | 'warning' | 'info' | 'error';
}

export const BadgeWidget: React.FC<BadgeWidgetProps> = ({ label, variant = 'info' }) => {
  return (
    <View style={[styles.base, styles[variant]]}>
      <Text style={[styles.label, styles[`${variant}Label` as keyof typeof styles]]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginVertical: 2,
  },
  success: { backgroundColor: '#D1FAE5' },
  warning: { backgroundColor: '#FEF3C7' },
  info: { backgroundColor: '#DBEAFE' },
  error: { backgroundColor: '#FEE2E2' },
  label: { fontSize: 12, fontWeight: '600' },
  successLabel: { color: '#065F46' },
  warningLabel: { color: '#92400E' },
  infoLabel: { color: '#1E40AF' },
  errorLabel: { color: '#991B1B' },
});
