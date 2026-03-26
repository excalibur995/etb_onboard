import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Reusable single tier; CascadingSelectWidget renders multiple tiers where each
// tier is disabled until its parent has a value selected.

export interface CascadingSelectWidgetProps {
  tiers: Array<{
    key: string;
    label?: string;
    placeholder?: string;
  }>;
}

export const CascadingSelectWidget: React.FC<CascadingSelectWidgetProps> = ({
  tiers = [],
}) => {
  return (
    <View style={styles.container}>
      {tiers.map((tier, index) => (
        <View key={tier.key} style={styles.tierContainer}>
          {tier.label && <Text style={styles.label}>{tier.label}</Text>}
          <TouchableOpacity
            style={[styles.selector, index > 0 && styles.selectorDisabled]}
            disabled={index > 0}
          >
            <Text style={styles.placeholder}>{tier.placeholder ?? 'Select…'}</Text>
            <Text style={styles.chevron}>▼</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 8, gap: 12 },
  tierContainer: {},
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 4 },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  selectorDisabled: { backgroundColor: '#F9FAFB', opacity: 0.5 },
  placeholder: { fontSize: 16, color: '#9CA3AF' },
  chevron: { fontSize: 12, color: '#6B7280' },
});
