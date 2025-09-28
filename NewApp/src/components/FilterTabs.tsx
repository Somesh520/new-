// src/components/FilterTabs.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
  selected: string;
  onChange: (key: string) => void;
  tabs?: { key: string; label: string }[];
};

const defaultTabs = [
  { key: 'all', label: 'All' },
  { key: 'todo', label: 'To do' },
  { key: 'progress', label: 'In progress' },
  { key: 'done', label: 'Completed' },
];

const FilterTabs: React.FC<Props> = ({ selected, onChange, tabs = defaultTabs }) => {
  return (
    <View style={styles.container}>
      {tabs.map((t) => {
        const active = selected === t.key;
        return (
          <TouchableOpacity
            key={t.key}
            onPress={() => onChange(t.key)}
            style={[styles.tab, active && styles.tabActive]}
          >
            <Text style={[styles.tabText, active && styles.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', marginTop: 12, paddingHorizontal: 12, justifyContent: 'space-between' },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    elevation: 1,
    alignItems: 'center',
    marginRight: 8,
  },
  tabActive: {
    backgroundColor: '#e6f0ff',
    borderWidth: 0,
  },
  tabText: { color: '#2a3b59', fontWeight: '600', fontSize: 13 },
  tabTextActive: { color: '#0d3e84' },
});

export default FilterTabs;
