import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export interface MoneyDisplayWidgetProps {
  label?: string;
  currency?: string;
  value?: number;
}

export const MoneyDisplayWidget: React.FC<MoneyDisplayWidgetProps> = ({
  label,
  currency = 'IDR',
  value = 0,
}) => {
  const formatted = new Intl.NumberFormat('id-ID').format(value);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Text style={styles.value}>
        <Text style={styles.currency}>{currency} </Text>
        {formatted}
      </Text>
    </View>
  );
};

export interface MoneyInputWidgetProps {
  label?: string;
  currency?: string;
  min?: number;
  max?: number;
  onChangeValue?: (val: number) => void;
}

export const MoneyInputWidget: React.FC<MoneyInputWidgetProps> = ({
  label,
  currency = 'IDR',
  onChangeValue,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputRow}>
        <Text style={styles.currencyPrefix}>{currency}</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          placeholder="0"
          placeholderTextColor="#9CA3AF"
          onChangeText={t => onChangeValue?.(Number(t.replace(/\D/g, '')))}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 4 },
  value: { fontSize: 28, fontWeight: '800', color: '#111827', letterSpacing: -1 },
  currency: { fontSize: 16, fontWeight: '500', color: '#6B7280' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  currencyPrefix: { fontSize: 16, fontWeight: '600', color: '#6B7280', marginRight: 8 },
  input: { flex: 1, fontSize: 20, fontWeight: '700', color: '#111827', paddingVertical: 12 },
});
