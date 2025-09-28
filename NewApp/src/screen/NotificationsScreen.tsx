import React, { useState } from 'react';
import {
  StyleSheet, View, Text, SafeAreaView, TouchableOpacity, ScrollView, Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import BottomTabs from '../components/BottomTabs';

// Dummy list of notifications & their icons/colors
const NOTIFICATIONS = [
  {
    title: 'Task Overdue : Submit it asap', time: '6 mins ago',
    icon: <Icon name="clipboard-alert-outline" size={25} color="#314A8D" />,
  },
  {
    title: 'Approval needed', time: '10 mins ago',
    icon: <Feather name="slash" size={25} color="#E45555" />,
  },
  {
    title: 'Meeting Reminder', time: '1 day ago',
    icon: <Feather name="clock" size={25} color="#F3C93B" />,
  },
  {
    title: 'Machine alert', time: '1 day ago',
    icon: <Feather name="alert-triangle" size={25} color="#E1483A" />,
  },
  {
    title: 'New message : Team meeting', time: '2 days ago',
    icon: <Feather name="mail" size={23} color="#E1706C" />,
  },
];

const tabOptions = [
  { label: 'View All', key: 'all' },
  { label: 'Unread', key: 'unread' },
  { label: 'Mark as read', key: 'read' },
];

const NotificationsScreen: React.FC<{ openDrawer?: () => void }> = (props) => {
  const navigation = useNavigation();
  const route = useRoute(); // This gives the current key
  const { openDrawer } = props;
  const [activeTab, setActiveTab] = useState('all');

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerCurve}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={openDrawer}>
            <Icon name="menu" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => (navigation as any).navigate('Notifications')}>
            <Icon name="bell-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab bar */}
      <View style={styles.tabsRow}>
        {tabOptions.map((tab, idx) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabBtn, activeTab === tab.key && styles.tabBtnActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notifications */}
      <ScrollView contentContainerStyle={{padding: 0, paddingBottom: 16}}>
        {NOTIFICATIONS.map((n, i) => (
          <View key={i}>
            <View style={styles.notiRow}>
              <View style={styles.notiIcon}>{n.icon}</View>
              <View style={{flex:1}}>
                <Text style={styles.notiTitle}>{n.title}</Text>
                <Text style={styles.notiSub}>{n.time}</Text>
              </View>
            </View>
            {i !== NOTIFICATIONS.length-1 && (
              <View style={styles.notiDivider} />
            )}
          </View>
        ))}
      </ScrollView>

      <BottomTabs
        active={route.name}
        onTabPress={key => {
          if (route.name !== key) navigation.navigate(key as never);
        }}
      />
    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7FA' },
  headerCurve: {
    backgroundColor: '#5C72A3',
    paddingBottom: 26,
    borderBottomLeftRadius: 49,
    borderBottomRightRadius: 49,
    marginBottom: 7,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingHorizontal: 18,
    height: 54,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 20.5,
    letterSpacing: 0.12,
    textAlign: 'center',
    flex: 1,
  },
  headerIconBtn: {
    padding: 4,
  },
  headerIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8EDFC',
    borderBottomWidth: 1,
    borderBottomColor: '#DAE0EC',
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 1,
  },
  tabBtn: {
    paddingVertical: 4, paddingHorizontal: 15, borderRadius: 37,
    marginRight: 8,
  },
  tabBtnActive: {
    backgroundColor: '#385AA9',
  },
  tabLabel: {
    fontSize: 14,
    color: '#818CB0',
    letterSpacing: 0.05,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 0.09,
  },
  notiRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 13, paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  notiIcon: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#F7F8FA',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E7E7EA',
  },
  notiTitle: {
    fontSize: 15.5,
    color: '#293554',
    marginBottom: 1,
    fontWeight: '600',
  },
  notiSub: {
    fontSize: 12.1,
    color: '#8B99BA',
    marginTop: 0,
  },
  notiDivider: {
    height: 1,
    backgroundColor: '#C0CCE7',
    marginHorizontal: 18,
    marginBottom: 0,
  },
  // Bottom navigation bar
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#D8DEEA',
    borderTopWidth: 1,
    borderTopColor: '#D6DEED',
    height: 61,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    elevation: 8,
  },
  navBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: 6,
  },
  navLabel: {
    fontSize: 11, color: '#9AA9C1', fontWeight: '500', marginTop: 3,
  },
  navLabelActive: {
    color: '#22325B', fontWeight: 'bold',
  },
});
