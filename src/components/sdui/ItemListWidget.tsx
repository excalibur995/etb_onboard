import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface ItemListWidgetProps {
  label?: string;
  items?: any[];
  onPress?: (item: any) => void;
}

export const ItemListWidget: React.FC<ItemListWidgetProps> = ({ label, items = [], onPress }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      {items.map((item, index) => (
        <TouchableOpacity
          key={item.key ?? index}
          style={[styles.item, index < items.length - 1 && styles.itemBorder]}
          onPress={() => onPress?.(item)}
          activeOpacity={0.7}
        >
          <View style={styles.itemContent}>
            <Text style={styles.itemLabel}>{item.label}</Text>
            {item.description && (
              <Text style={styles.itemDescription}>{item.description}</Text>
            )}
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemContent: { flex: 1 },
  itemLabel: { fontSize: 16, color: '#111827' },
  itemDescription: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  chevron: { fontSize: 22, color: '#9CA3AF', marginLeft: 8 },
});
