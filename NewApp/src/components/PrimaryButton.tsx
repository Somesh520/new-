// src/components/PrimaryButton.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const PrimaryButton: React.FC<{ title: string; onPress?: () => void }> = ({
  title,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Text style={styles.btnText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#1F59A7",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
