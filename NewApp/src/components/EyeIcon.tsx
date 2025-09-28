import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface EyeIconProps {
  isVisible: boolean;
  onToggle: () => void;
}

const EyeIcon = ({ isVisible, onToggle }: EyeIconProps) => {
  return (
    <TouchableOpacity onPress={onToggle} style={styles.eyeButton} activeOpacity={0.7}>
      <Ionicons
        name={isVisible ? 'eye-outline' : 'eye-off-outline'}
        size={22}
        color="#666"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  eyeButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
    minHeight: 40,
  },
});

export default EyeIcon;