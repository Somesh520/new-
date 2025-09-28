// src/components/Header.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  title?: string;
  onMenuPress?: () => void;
  onBellPress?: () => void;
};

const Header: React.FC<Props> = ({ title = 'Task Management', onMenuPress, onBellPress }) => {
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity onPress={onMenuPress} style={styles.left}>
          <Icon name="menu" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>{title}</Text>

        <TouchableOpacity onPress={onBellPress} style={styles.right}>
          <Icon name="bell-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    backgroundColor: '#1f5fbf', // primary header color
  },
  container: {
    height: 70,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: { width: 40, alignItems: 'flex-start' },
  right: { width: 40, alignItems: 'flex-end' },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

export default Header;
