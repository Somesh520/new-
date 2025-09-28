// src/components/CreateTaskButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

type Props = {
  onPress?: () => void;
};

const CreateTaskButton: React.FC<Props> = ({ onPress }) => {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.text}>+ Create Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { width: '100%', paddingHorizontal: 16, marginTop: 6 },
  button: {
    backgroundColor: '#0d3e84',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  text: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

export default CreateTaskButton;
