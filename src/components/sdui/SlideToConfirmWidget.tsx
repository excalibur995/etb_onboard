import React, { useState } from 'react';
import { Animated, PanResponder, StyleSheet, Text, View } from 'react-native';

export interface SlideToConfirmWidgetProps {
  label: string;
  onConfirm?: () => void;
  disabled?: boolean;
}

const TRACK_WIDTH = 300;
const THUMB_WIDTH = 60;
const MAX_SLIDE = TRACK_WIDTH - THUMB_WIDTH;

export const SlideToConfirmWidget: React.FC<SlideToConfirmWidgetProps> = ({
  label,
  onConfirm,
  disabled = false,
}) => {
  const [confirmed, setConfirmed] = useState(false);
  const pan = React.useRef(new Animated.Value(0)).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !disabled && !confirmed,
    onPanResponderMove: (_, gs) => {
      const clamped = Math.max(0, Math.min(gs.dx, MAX_SLIDE));
      pan.setValue(clamped);
    },
    onPanResponderRelease: (_, gs) => {
      if (gs.dx >= MAX_SLIDE * 0.9) {
        Animated.spring(pan, { toValue: MAX_SLIDE, useNativeDriver: false }).start(() => {
          setConfirmed(true);
          onConfirm?.();
        });
      } else {
        Animated.spring(pan, { toValue: 0, useNativeDriver: false }).start();
      }
    },
  });

  return (
    <View style={[styles.track, disabled && styles.disabled]}>
      <Text style={[styles.label, confirmed && styles.labelConfirmed]}>
        {confirmed ? 'Confirmed ✓' : label}
      </Text>
      <Animated.View
        style={[styles.thumb, { transform: [{ translateX: pan }] }]}
        {...panResponder.panHandlers}
      >
        <Text style={styles.thumbIcon}>{confirmed ? '✓' : '›'}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    alignSelf: 'center',
    marginVertical: 16,
  },
  disabled: { opacity: 0.4 },
  label: {
    position: 'absolute',
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  labelConfirmed: { color: '#16A34A' },
  thumb: {
    position: 'absolute',
    left: 0,
    width: THUMB_WIDTH,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFCC00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbIcon: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
});
