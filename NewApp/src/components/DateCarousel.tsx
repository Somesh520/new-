    // src/components/DateCarousel.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { format } from 'date-fns';

type DateItem = {
  id: string;
  date: Date;
};

type Props = {
  dates: DateItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
};

const DateCarousel: React.FC<Props> = ({ dates, activeId, onSelect }) => {
  return (
    <View style={styles.wrapper}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={dates}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingLeft: 12, paddingRight: 12 }}
        renderItem={({ item }) => {
          const isActive = item.id === activeId;
          return (
            <TouchableOpacity onPress={() => onSelect(item.id)} style={[styles.pill, isActive && styles.pillActive]}>
              <Text style={[styles.pillSmall, isActive && styles.pillSmallActive]}>
                {format(item.date, 'MMM dd')}
              </Text>
              <Text style={[styles.pillDay, isActive && styles.pillDayActive]}>
                {format(item.date, 'EEE')}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginTop: 12 },
  pill: {
    width: 68,
    height: 68,
    borderRadius: 16,
    backgroundColor: '#e9eef8',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillActive: {
    backgroundColor: '#0d3e84',
  },
  pillSmall: { fontSize: 12, color: '#4f6b8f' },
  pillSmallActive: { color: '#fff', fontWeight: '700' },
  pillDay: { fontSize: 12, color: '#5c6f87', marginTop: 2 },
  pillDayActive: { color: '#fff' },
});

export default DateCarousel;
