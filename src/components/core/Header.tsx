import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type HeaderProps = {
  iconColor?: string;
  title?: string;
  rightIconName?: string | false;
  onRightPress?: () => void;
  leftIconName?: string | false;
  onLeftPress?: () => void;
  showBorder?: boolean;
};

// Simple text-based icons since we don't have react-native-vector-icons
const Icon = ({ name, color }: { name: string; color: string }) => {
  let char = '';
  let fontSize = 24;
  let fontWeight: any = '300';
  let lineHeight = fontSize;
  let marginTop = 0;

  if (name === 'back') {
    char = '‹';
    fontSize = 32;
    lineHeight = 32;
    marginTop = -4; // align visual center
  } else if (name === 'close') {
    char = '✕';
    fontSize = 20;
    lineHeight = 20;
  } else if (name === 'download') {
    char = '↓';
    fontSize = 22;
    lineHeight = 22;
  } else {
    char = name;
  }

  return (
    <Text style={{ color, fontSize, fontWeight, lineHeight, marginTop }}>
      {char}
    </Text>
  );
};

export const Header: React.FC<HeaderProps> = ({
  iconColor = 'black',
  title,
  rightIconName,
  onRightPress,
  leftIconName,
  onLeftPress,
  showBorder = false,
}) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  return (
    <View
      style={[
        styles.container,
        { paddingTop: Math.max(insets.top, 16) },
        showBorder && styles.border,
      ]}
    >
      <View style={styles.leftContainer}>
        {leftIconName ? (
          <TouchableOpacity onPress={onLeftPress} style={styles.iconButton}>
            <Icon name={leftIconName} color={iconColor} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.centerContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>M</Text>
        </View>
        <Text style={styles.titleText}>{t(title || '')}</Text>
      </View>

      <View style={styles.rightContainer}>
        {rightIconName ? (
          <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
            <Icon name={rightIconName} color={iconColor} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  border: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 8,
    backgroundColor: 'transparent',
    minHeight: 56,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  iconButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
    minHeight: 40,
  },
  logoCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFCC00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  logoText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  titleText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
    letterSpacing: -0.5,
  },
});
