import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import BottomTabs from '../components/BottomTabs';

export const ServiceLogsScreen: React.FC<{ openDrawer?: () => void }> = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { openDrawer } = props;
  const [checked, setChecked] = useState({
    closeQuery: true,
    notify: false,
    urgent: false,
  });
  const [note, setNote] = useState('');
  const [uploadName, setUploadName] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerCurve}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={openDrawer}>
            <Icon name="menu" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Service Logs</Text>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => (navigation as any).navigate('Notifications')}>
            <Icon name="bell-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.bodyContent}>
        {/* Card with avatar and title */}
        <View style={styles.infoCard}>
          <View style={styles.avatarWrap}>
            <Image
              source={require('../assets/tabs/serverMaintain.png')}
              style={styles.avatarImg}
              resizeMode="cover"
            />
          </View>
          <View style={{ flex: 1, marginHorizontal: 8 }}>
            <Text style={styles.infoTitle}>Server Maintenance</Text>
            <Text style={styles.infoSub}>2024/2025/20</Text>
          </View>
          <Text style={styles.iconText}>✓</Text>
        </View>

        {/* Timeline Card */}
        <View style={styles.timelineCard}>
          <TimelineItem title="Server Maintenance" subtitle="Completed on x/xx/xxxx" active />
          <TimelineItem title="Backup" subtitle="Scheduled on x/xx/xxxx" />
          <TimelineItem title="Update" subtitle="Pending" />
          <TimelineItem title="Scanning" subtitle="Completed on x/xx/xxxx" />
        </View>

        {/* Add Log button */}
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>+ Add Log</Text>
        </TouchableOpacity>

        {/* Service History */}
        <Text style={styles.sectionTitle}>Service History</Text>
        <Text style={styles.sectionBody}>
          At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium
          voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint
          occaecati cupiditate non provident, similique...
        </Text>

        {/* Upload Report */}
        <TouchableOpacity style={styles.uploadCard}>
          <Text style={styles.iconText}>📤</Text>
          <Text style={styles.uploadLabel}>{uploadName || 'Upload Report'}</Text>
        </TouchableOpacity>

        {/* Notes Input */}
        <Text style={styles.notesLabel}>Notes</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Add Notes here"
          placeholderTextColor="#687399"
          multiline
          numberOfLines={5}
          value={note}
          onChangeText={setNote}
        />

        {/* Checkbox Card */}
        <View style={styles.checkboxCard}>
          <TouchableOpacity 
            style={styles.checkBoxContainer}
            onPress={() => setChecked(c => ({ ...c, closeQuery: !c.closeQuery }))}
          >
            <Text style={styles.checkBoxIcon}>{checked.closeQuery ? '☑️' : '☐'}</Text>
            <Text style={styles.cbLbl}>Close Ticket/Query</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.checkBoxContainer}
            onPress={() => setChecked(c => ({ ...c, notify: !c.notify }))}
          >
            <Text style={styles.checkBoxIcon}>{checked.notify ? '☑️' : '☐'}</Text>
            <Text style={styles.cbLbl}>Notify Team</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.checkBoxContainer}
            onPress={() => setChecked(c => ({ ...c, urgent: !c.urgent }))}
          >
            <Text style={styles.checkBoxIcon}>{checked.urgent ? '☑️' : '☐'}</Text>
            <Text style={styles.cbLbl}>Mark as Urgent</Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitBtn}>
          <Text style={styles.submitBtnText}>Submit</Text>
        </TouchableOpacity>
        <View style={{ height: 20 }} />
      </ScrollView>

      <BottomTabs
        active={route.name}
        onTabPress={key => {
          if (route.name !== key) navigation.navigate(key as never);
        }}
      />
    </SafeAreaView>
  );
}

// TIMELINE ITEM
function TimelineItem({ title, subtitle, active = false }: { title: string; subtitle: string; active?: boolean }) {
  return (
    <View style={timelineStyles.row}>
      <View>
        <Text style={[timelineStyles.circleIcon, { color: active ? "#4766B4" : "#BCD1F3" }]}>●</Text>
        <View style={timelineStyles.line} />
      </View>
      <View>
        <Text style={[timelineStyles.tlTitle, active && { color: '#314A8D' }]}>{title}</Text>
        <Text style={timelineStyles.tlSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const timelineStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 7 },
  line: { width: 1.6, height: 22, backgroundColor: '#BCD1F3', marginLeft: 6, marginBottom: -2 },
  tlTitle: { fontWeight: '600', fontSize: 13, color: '#232D3E' },
  tlSubtitle: { color: '#535976', fontSize: 12, marginBottom: 4 },
  circleIcon: {
    fontSize: 14,
    marginRight: 8,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7FA' },
  headerCurve: {
    backgroundColor: '#5C72A3',
    paddingBottom: 28,
    borderBottomLeftRadius: 55,
    borderBottomRightRadius: 55,
    marginBottom: 7,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingHorizontal: 16,
    height: 52,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 21,
    letterSpacing: 0.15,
    textAlign: 'center',
    flex: 1,
  },
  headerIconBtn: { padding: 4 },
  bodyContent: { paddingHorizontal: 12, paddingTop: 5, paddingBottom: 18 },
  infoCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#E9EDF7',
    borderRadius: 11, marginVertical: 7, padding: 10, elevation: 2,
  },
  avatarWrap: {
    width: 44, height: 44, borderRadius: 23, backgroundColor: '#DEEBF9',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 8, overflow: 'hidden'
  },
  avatarImg: { width: 40, height: 40, borderRadius: 20 },
  infoTitle: { fontWeight: 'bold', fontSize: 15.2, color: '#294066' },
  infoSub: { fontSize: 12.2, color: '#9BA8C7' },
  timelineCard: {
    backgroundColor: '#ECEFF3',
    borderRadius: 9,
    padding: 13,
    marginBottom: 10,
    marginTop: 4,
  },
  actionBtn: {
    backgroundColor: '#304A90',
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 7,
    marginBottom: 10,
    width: '100%',
    alignSelf: "center"
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 16.2,
    fontWeight: 'bold',
    letterSpacing: 0.13,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#222831',
    fontSize: 16,
    marginVertical: 7,
  },
  sectionBody: { fontSize: 13.5, color: '#444950', marginBottom: 11 },
  uploadCard: {
    backgroundColor: '#E5E8ED',
    borderRadius: 9,
    flexDirection: "row",
    alignItems: 'center',
    height: 65,
    marginBottom: 15,
    paddingHorizontal: 16,
  },
  uploadIcon: { marginRight: 13 },
  uploadLabel: { color: '#5F6B7C', fontWeight: "bold", fontSize: 13 },
  notesLabel: { fontWeight: '600', fontSize: 14, marginBottom: 6, color: '#2B2B34' },
  notesInput: {
    backgroundColor: '#C8D1EB',
    borderRadius: 9,
    padding: 12,
    fontSize: 15,
    color: '#182041',
    marginBottom: 18,
    minHeight: 60,
    height: 100,
  },
  checkboxCard: { backgroundColor: '#E7EAED', borderRadius: 11, padding: 12, marginBottom: 12 },
  checkBoxOuter: {
    backgroundColor: 'transparent',
    margin: 0,
    paddingVertical: 0,
    borderWidth: 0,
  },
  cbLbl: { color: '#3A3A46', fontSize: 14.5, fontWeight: 'bold' },
  iconText: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  checkBoxIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  submitBtn: {
    backgroundColor: '#304A90',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 13,
    marginTop: 7,
    marginBottom: 6,
    width: '100%',
    alignSelf: "center"
  },
  submitBtnText: { color: '#fff', fontSize: 16.8, fontWeight: 'bold', letterSpacing: 0.08 },
});
