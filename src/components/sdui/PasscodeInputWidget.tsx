import React, { useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from 'react-native';

export interface PasscodeInputWidgetProps {
  length?: number;
  masked?: boolean;
  onComplete?: (value: string) => void;
  onForgot?: () => void;
}

export const PasscodeInputWidget: React.FC<PasscodeInputWidgetProps> = ({
  length = 6,
  masked = true,
  onComplete,
  onForgot,
}) => {
  const [code, setCode] = useState<string[]>(Array(length).fill(''));
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    const full = newCode.join('');
    if (full.length === length) {
      onComplete?.(full);
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {Array.from({ length }).map((_, i) => (
          <TextInput
            key={i}
            ref={ref => { inputs.current[i] = ref; }}
            style={[styles.cell, code[i] ? styles.cellFilled : null]}
            value={masked && code[i] ? '•' : code[i]}
            onChangeText={text => handleChange(text.slice(-1), i)}
            onKeyPress={e => handleKeyPress(e, i)}
            keyboardType="number-pad"
            maxLength={1}
            caretHidden
          />
        ))}
      </View>
      {onForgot && (
        <View style={styles.forgotRow}>
          <Text onPress={onForgot} style={styles.forgot}>
            Forgot Passcode?
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  cell: {
    width: 48,
    height: 56,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    textAlign: 'center',
    fontSize: 24,
    backgroundColor: '#FFFFFF',
    color: '#111827',
  },
  cellFilled: {
    borderColor: '#FFCC00',
    borderWidth: 2,
  },
  forgotRow: {
    marginTop: 16,
    alignItems: 'center',
  },
  forgot: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },
});
