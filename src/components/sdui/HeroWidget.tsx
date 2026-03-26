import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface HeroWidgetProps {
  title: string;
  subtitleTemplate?: string;
}

export const HeroWidget: React.FC<HeroWidgetProps> = ({ title, subtitleTemplate }) => {
  return (
    <View style={styles.container}>
      {/* Placeholder for illustration */}
      <View style={styles.illustrationPlaceholder}>
        <Text style={styles.iconText}>✧</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitleTemplate ? (
        <Text style={styles.subtitle}>{subtitleTemplate}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  illustrationPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FEF3C7', // Light yellow
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  iconText: {
    fontSize: 48,
    color: '#F59E0B',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});
