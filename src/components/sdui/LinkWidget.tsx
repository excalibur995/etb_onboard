import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface LinkWidgetProps {
  text: string;
  onPress?: () => void;
}

export const LinkWidget: React.FC<LinkWidgetProps> = ({ text, onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.linkText}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16,
    color: '#2563EB', // Blue to indicate interactability
    fontWeight: '600',
  },
});
