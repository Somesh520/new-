// src/components/ProfileInput.tsx
import React from "react";
import { TextInput, StyleSheet, View, TextInputProps } from "react-native";

type Props = TextInputProps & {
  value: string;
  onChangeText: (val: string) => void;
};

const ProfileInput: React.FC<Props> = ({ value, onChangeText, ...rest }) => {
  return (
    <View style={styles.wrap}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        {...rest}
      />
    </View>
  );
};

export default ProfileInput;

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F3F3F4",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 24,
    fontSize: 15,
    color: "#111827",
  },
});
