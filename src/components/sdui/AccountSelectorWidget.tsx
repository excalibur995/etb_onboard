import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// AccountSelectorWidget - live account picker. Displays a loading skeleton by default.
// Actual data fetching should be driven via the SDUI action/onNavigate pattern,
// not embedded here directly to keep widget pure.

export interface AccountSelectorWidgetProps {
  label?: string;
  allowChange?: boolean;
  placeholder?: string;
}

export const AccountSelectorWidget: React.FC<AccountSelectorWidgetProps> = ({
  label,
  allowChange = true,
  placeholder = 'Select an account',
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.selector}>
        <View style={styles.accountIcon}>
          <Text style={styles.iconText}>$</Text>
        </View>
        <View style={styles.selectorContent}>
          <Text style={styles.placeholder}>{placeholder}</Text>
        </View>
        {allowChange && <Text style={styles.chevron}>›</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  accountIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 16, fontWeight: '800', color: '#92400E' },
  selectorContent: { flex: 1 },
  placeholder: { fontSize: 15, color: '#9CA3AF' },
  chevron: { fontSize: 22, color: '#9CA3AF' },
});
