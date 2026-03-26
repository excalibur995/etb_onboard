import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface CheckboxListWidgetProps {
  label?: string;
  items?: any[];
}

export const CheckboxListWidget: React.FC<CheckboxListWidgetProps> = ({
  label,
  items = [],
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      {items.map((item, index) => (
        <TouchableOpacity key={index} style={styles.itemContainer}>
          <View style={styles.checkboxOuter}>
            {/* Active state checkmark could go here */}
          </View>
          <Text style={styles.itemText}>{item.label || 'Item'}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxOuter: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  itemText: {
    fontSize: 16,
    color: '#374151',
  },
});
