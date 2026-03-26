import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface RadioGroupWidgetProps {
  label?: string;
  options: any[];
}

export const RadioGroupWidget: React.FC<RadioGroupWidgetProps> = ({
  label,
  options = [],
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      {options.map((option, index) => (
        <TouchableOpacity key={index} style={styles.optionContainer}>
          <View style={styles.radioOuter}>
            {/* Active state styling could go here */}
          </View>
          <Text style={styles.optionText}>{option.label || 'Option'}</Text>
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
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
  },
});
