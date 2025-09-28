import React, { useState, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

import DateCarousel from '../components/DateCarousel';
import FilterTabs from '../components/FilterTabs';
import TaskCard from '../components/TaskCard';
import CreateTaskButton from '../components/CreateTaskButton';

// Tab icons using MaterialCommunityIcons
const TAB_ICONS = {
  Dashboard: 'view-dashboard-outline',
  Tasks: 'clipboard-list-outline',
  Settings: 'cog-outline',
};

const tasksTabs = [
  { key: 'HomeScreen', label: 'Dashboard', icon: TAB_ICONS.Dashboard },
  { key: 'TasksScreen', label: 'Tasks', icon: TAB_ICONS.Tasks },
  { key: 'ProfileScreen', label: 'Settings', icon: TAB_ICONS.Settings },
];

// Sample dates and tasks
const sampleDates = [
  { id: '1', date: new Date(2024, 0, 21) },
  { id: '2', date: new Date(2024, 0, 22) },
  { id: '3', date: new Date(2024, 0, 23) },
  { id: '4', date: new Date(2024, 0, 24) },
  { id: '5', date: new Date(2024, 0, 25) },
];

const sampleTasks = [
  { id: 't1', title: 'Complete UI for dashboard', time: '09:00 AM', status: 'todo' as const, dateId: '3' },
  { id: 't2', title: 'Fix API integration', time: '11:30 AM', status: 'progress' as const, dateId: '3' },
  { id: 't3', title: 'Team meeting with client', time: '01:00 PM', status: 'done' as const, dateId: '3' },
  { id: 't4', title: 'Prepare monthly report', time: '04:00 PM', status: 'todo' as const, dateId: '4' },
];

const TasksScreen: React.FC<{ openDrawer?: () => void }> = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { openDrawer } = props;
  const [activeDateId, setActiveDateId] = useState<string | null>(sampleDates[2].id);
  const [filter, setFilter] = useState<string>('all');

  const tasksToShow = useMemo(() => {
    return sampleTasks.filter((t) => {
      const matchesDate = !activeDateId || t.dateId === activeDateId;
      const matchesFilter =
        filter === 'all'
          ? true
          : filter === 'todo'
          ? t.status === 'todo'
          : filter === 'progress'
          ? t.status === 'progress'
          : t.status === 'done';
      return matchesDate && matchesFilter;
    });
  }, [activeDateId, filter]);

  const handleTabPress = (key: string) => {
    if (key === 'ProfileScreen') {
      navigation.navigate('ProfileScreen' as never);
    } else if (route.name !== key) {
      navigation.navigate(key as never);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconBtn} onPress={openDrawer}>
          <Icon name="menu" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tasks</Text>
  <TouchableOpacity style={styles.headerIconBtn} onPress={() => (navigation as any).navigate('Notifications')}>
          <Icon name="bell-outline" size={26} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <DateCarousel
            dates={sampleDates}
            activeId={activeDateId}
            onSelect={(id) => setActiveDateId(id)}
          />

          <FilterTabs selected={filter} onChange={(k) => setFilter(k)} />

          <View style={{ marginTop: 12 }}>
            {tasksToShow.length === 0 ? (
              <Text style={styles.empty}>No tasks for this filter</Text>
            ) : (
              tasksToShow.map((task) => (
                <TaskCard
                  key={task.id}
                  title={task.title}
                  timeLabel={task.time}
                  status={task.status}
                  onPress={() => {}}
                />
              ))
            )}
          </View>

          <CreateTaskButton onPress={() => { /* navigate to create screen or open modal */ }} />
        </ScrollView>

        {/* Custom Admin Bottom Tabs (no box, only icon, handle settings navigation) */}
        <View style={styles.bottomBar}>
          {tasksTabs.map((tab) => {
            const isActive = tab.key === route.name;
            return (
              <TouchableOpacity
                key={tab.key}
                style={styles.bottomTab}
                onPress={() => handleTabPress(tab.key)}
                activeOpacity={0.8}
              >
                <Icon
                  name={tab.icon}
                  size={26}
                  color={isActive ? "#22325B" : "#9AA9C1"}
                />
                <Text style={[styles.bottomLabel, isActive && styles.bottomLabelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
    safeArea: {
      flex: 1,
      backgroundColor: '#fff',
    },
  // HEADER BAR
  header: {
    backgroundColor: '#5C72A3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    height: 60,
    elevation: 4,
    shadowColor: '#5C72A3',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { height: 2, width: 0 },
  },
  headerIconBtn: { padding: 4 },
  headerIcon: { width: 24, height: 24, tintColor: '#fff' },
  headerTitle: {
    color: '#fff', fontWeight: '600', fontSize: 21, letterSpacing: 0.2,
    textAlign: 'center', flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 92, // leave space for bottom bar
  },
  empty: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    color: '#777',
  },
  // Custom admin bottom bar (not BottomTabs, only for this screen)
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#D8DEEA',
    borderTopColor: '#D6DEED',
    borderTopWidth: 1,
    height: 61,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Platform.OS === "ios" ? 6 : 0,
  },
  bottomTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
  },
  bottomIcon: {
    width: 28, // Slightly reduced for admin
    height: 28,
    marginBottom: 2,
  },
  bottomLabel: {
    fontSize: 11,
    color: '#9AA9C1',
    fontWeight: "500",
    textAlign: "center",
    marginTop: 1,
  },
  bottomLabelActive: {
    color: '#22325B',
    fontWeight: "bold",
  },
});

export default TasksScreen;
