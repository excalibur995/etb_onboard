import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

export interface SectionLabelWidgetProps {
  title: string;
  subtitle?: string;
}

export const SectionLabelWidget: React.FC<SectionLabelWidgetProps> = ({
  title,
  subtitle,
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t(title)}</Text>
      {subtitle && <Text style={styles.subtitle}>{t(subtitle)}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#00000',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
