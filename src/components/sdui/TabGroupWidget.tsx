import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface TabGroupWidgetProps {
  options: Array<{ key: string; label: string }>;
  onSelect?: (key: string) => void;
}

export const TabGroupWidget: React.FC<TabGroupWidgetProps> = ({ options = [], onSelect }) => {
  const [selected, setSelected] = useState(options[0]?.key ?? '');

  const handleSelect = (key: string) => {
    setSelected(key);
    onSelect?.(key);
  };

  return (
    <View style={styles.container}>
      {options.map(option => (
        <TouchableOpacity
          key={option.key}
          style={[styles.tab, selected === option.key && styles.activeTab]}
          onPress={() => handleSelect(option.key)}
        >
          <Text style={[styles.label, selected === option.key && styles.activeLabel]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
    marginVertical: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  label: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  activeLabel: { color: '#111827', fontWeight: '700' },
});
