import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface Props {
  currentStep?: number;
  totalSteps?: number;
  showLabel?: boolean;
}

export const Stepper: React.FC<Props> = ({
  currentStep = 1,
  totalSteps = 1,
  showLabel = true,
}) => {
  // Clamp values to prevent > 100% or < 0% width
  const safeCurrent = Math.max(0, Math.min(currentStep, totalSteps));
  const safeTotal = Math.max(1, totalSteps);
  const progressPercent = (safeCurrent / safeTotal) * 100;

  const [widthAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: progressPercent,
      duration: 300,
      useNativeDriver: false, // width/flex animation cannot use native driver
    }).start();
  }, [progressPercent, widthAnim]);

  const widthStyle = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.barBackground}>
        <Animated.View style={[styles.barFill, { width: widthStyle }]} />
      </View>
      {showLabel && (
        <Text style={styles.label}>
          Step {safeCurrent} of {safeTotal}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    gap: 16,
  },
  barBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E5E5', // Light gray track background
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#388E3C', // The green color from the screenshot
    borderRadius: 4,
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: 'normal',
  },
});
