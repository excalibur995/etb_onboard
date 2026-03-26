import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface KVRowWidgetProps {
  label?: string;
  value?: string;
}

export interface ReviewCardWidgetProps {
  label?: string;
  rows?: KVRowWidgetProps[];
  allowChange?: boolean;
  onEdit?: () => void;
}

export const ReviewCardWidget: React.FC<ReviewCardWidgetProps> = ({
  label,
  rows = [],
  allowChange = false,
  onEdit,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {label && <Text style={styles.cardTitle}>{label}</Text>}
        {allowChange && (
          <TouchableOpacity onPress={onEdit}>
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>
      {rows.map((row, index) => (
        <View
          key={index}
          style={[styles.row, index < rows.length - 1 && styles.rowBorder]}
        >
          <Text style={styles.rowLabel}>{row.label}</Text>
          <Text style={styles.rowValue}>{row.value ?? '—'}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  editButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  rowLabel: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    textAlign: 'right',
  },
});
