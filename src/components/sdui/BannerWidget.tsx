import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface BannerWidgetProps {
  text: string;
  variant?: 'info' | 'warning' | 'success' | 'error';
  label?: string;
  onPress?: () => void;
}

const ICONS: Record<string, string> = {
  info: 'ℹ',
  warning: '⚠',
  success: '✓',
  error: '✕',
};

export const BannerWidget: React.FC<BannerWidgetProps> = ({
  text,
  variant = 'info',
  label,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.75 : 1}
      style={[styles.base, styles[variant]]}
    >
      <Text style={[styles.icon, styles[`${variant}Text` as keyof typeof styles]]}>
        {ICONS[variant]}
      </Text>
      <View style={styles.content}>
        <Text style={[styles.text, styles[`${variant}Text` as keyof typeof styles]]}>
          {text}
        </Text>
        {label && (
          <Text style={[styles.label, styles[`${variant}Text` as keyof typeof styles]]}>
            {label}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    gap: 8,
  },
  info: { backgroundColor: '#EFF6FF', borderLeftWidth: 3, borderLeftColor: '#3B82F6' },
  warning: { backgroundColor: '#FFFBEB', borderLeftWidth: 3, borderLeftColor: '#F59E0B' },
  success: { backgroundColor: '#F0FDF4', borderLeftWidth: 3, borderLeftColor: '#22C55E' },
  error: { backgroundColor: '#FEF2F2', borderLeftWidth: 3, borderLeftColor: '#EF4444' },
  icon: { fontSize: 16, fontWeight: '700', marginTop: 1 },
  content: { flex: 1 },
  text: { fontSize: 14, lineHeight: 20 },
  label: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  infoText: { color: '#1E40AF' },
  warningText: { color: '#92400E' },
  successText: { color: '#166534' },
  errorText: { color: '#991B1B' },
});
