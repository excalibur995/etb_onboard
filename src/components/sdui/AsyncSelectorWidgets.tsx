import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Async variants of RadioGroup, CheckboxList, and Dropdown.
// They show a loading state and are wired to receive options once loaded.
// Actual data fetching is handled outside (via the onAction/DynamicZoneRenderer pattern).

export interface AsyncSelectorWidgetProps {
  label?: string;
  placeholder?: string;
  isLoading?: boolean;
  options?: Array<{ key: string; label: string }>;
  variant: 'dropdown' | 'radio' | 'checkbox';
  onPress?: () => void; // for dropdown open
}

export const AsyncSelectorWidget: React.FC<AsyncSelectorWidgetProps> = ({
  label,
  placeholder = 'Select…',
  isLoading = false,
  options = [],
  variant,
  onPress,
}) => {
  if (isLoading) {
    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={styles.loading}>
          <ActivityIndicator size="small" color="#6B7280" />
          <Text style={styles.loadingText}>Loading options…</Text>
        </View>
      </View>
    );
  }

  if (variant === 'dropdown') {
    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TouchableOpacity style={styles.dropdownButton} onPress={onPress}>
          <Text style={styles.placeholder}>{placeholder}</Text>
          <Text style={styles.chevron}>▼</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      {options.map((opt, _i) => (
        <TouchableOpacity key={opt.key} style={styles.optionRow}>
          <View
            style={[
              styles.selector,
              variant === 'checkbox' ? styles.checkbox : styles.radio,
            ]}
          />
          <Text style={styles.optionLabel}>{opt.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Named exports for each variant to register independently in the registry
export const DropdownAsyncWidget: React.FC<Omit<AsyncSelectorWidgetProps, 'variant'>> = props => (
  <AsyncSelectorWidget {...props} variant="dropdown" />
);
export const RadioGroupAsyncWidget: React.FC<Omit<AsyncSelectorWidgetProps, 'variant'>> = props => (
  <AsyncSelectorWidget {...props} variant="radio" />
);
export const CheckboxListAsyncWidget: React.FC<Omit<AsyncSelectorWidgetProps, 'variant'>> = props => (
  <AsyncSelectorWidget {...props} variant="checkbox" />
);

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 4 },
  loading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  loadingText: { fontSize: 14, color: '#6B7280' },
  dropdownButton: {
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
  placeholder: { fontSize: 16, color: '#9CA3AF' },
  chevron: { fontSize: 12, color: '#6B7280' },
  optionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 10 },
  selector: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  radio: { borderRadius: 10 },
  checkbox: { borderRadius: 4 },
  optionLabel: { fontSize: 16, color: '#374151' },
});
