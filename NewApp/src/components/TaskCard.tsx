// src/components/TaskCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

type Props = {
  title: string;
  timeLabel?: string;
  status?: 'todo' | 'progress' | 'done';
  onPress?: () => void;
};

const statusLabel = (s?: Props['status']) => {
  if (s === 'progress') return 'In progress';
  if (s === 'done') return 'Completed';
  return 'To do';
};

const TaskCard: React.FC<Props> = ({ title, timeLabel = '10:00 AM', status = 'todo', onPress }) => {
  const background = status === 'done' ? '#f2f7f2' : '#fff';
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, { backgroundColor: background }]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.clockIcon}>🕒</Text>
          <Text style={styles.timeText}>{timeLabel}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <View style={[styles.statusPill, status === 'todo' && styles.pillTodo, status === 'progress' && styles.pillProgress, status === 'done' && styles.pillDone]}>
          <Text style={[styles.statusText, status === 'done' && { color: '#0b6a2a' }]}>{statusLabel(status)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 88,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: '700', color: '#203145', marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  clockIcon: { fontSize: 14, color: '#7b8ba0' },
  timeText: { marginLeft: 8, color: '#7b8ba0', fontSize: 13 },
  right: { justifyContent: 'center', alignItems: 'center' },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: '#eaf2ff',
  },
  pillTodo: { backgroundColor: '#eaf2ff' },
  pillProgress: { backgroundColor: '#fff4e6' },
  pillDone: { backgroundColor: '#e8f6ea' },
  statusText: { fontSize: 12, color: '#0d3e84', fontWeight: '700' },
});

export default TaskCard;
