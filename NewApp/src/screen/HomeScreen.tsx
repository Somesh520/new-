import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomTabs from '../components/BottomTabs';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useAuth } from '../context/AuthContext';

let DEFAULT_MACHINES = [
  'Machine A',
  'Machine B',
  'Machine C',
  'Machine D',
  'Machine E',
  'Machine F',
];

type RootStackParamList = {
  Home: undefined;
  AddCustomer: undefined;
  Notifications: undefined;
  TasksScreen: undefined;
};

const dashboardItems = [
  {
    title: 'Pending Amounts',
    subtitle: 'Finance',
    icon: require('../assets/tabs/PendingAmount.png'),
    rightIcon: require('../assets/tabs/dollar.png'),
  },
  {
    title: 'Active Requests',
    subtitle: 'Requests',
    icon: require('../assets/tabs/activeRequests.png'),
    rightIcon: require('../assets/tabs/calender.png'),
  },
  {
    title: 'Customers Served',
    subtitle: 'Customers',
    icon: require('../assets/tabs/customerServedBig.png'),
    rightIcon: require('../assets/tabs/customer.png'),
  },
];

export default function HomeScreen(props: any) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { openDrawer } = props;
  const { user } = useAuth();
  const USER_ROLE = user?.role || 'Guest';
  const token = user?.token;

  // Machines related state
  const [machineList, setMachineList] = useState<string[]>([...DEFAULT_MACHINES]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [addingMachine, setAddingMachine] = useState(false);
  const [fetchingMachines, setFetchingMachines] = useState(false);
  const [newMachineName, setNewMachineName] = useState('');
  const [newModelName, setNewModelName] = useState('');
  const [newModelNumber, setNewModelNumber] = useState('');

  // Fetch machines from backend
  // No backend fetch, always use DEFAULT_MACHINES

  // Add new machine API call
 const handleAddMachine = async () => {
  if (newMachineName && newModelName && newModelNumber) {
    try {
      const res = await axios.post(
        'http://192.168.10.142:5000/api/machine',
        {
          machineName: newMachineName.trim(),
          modelName: newModelName.trim(),
          modelNumber: newModelNumber.trim(),
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (res.data && res.data.success) {
        Toast.show({
          type: 'success',
          text1: 'Machine Added',
          text2: res.data.message || 'Machine has been added successfully!',
        });
        setAddingMachine(false);
        setDropdownVisible(false);
        setNewMachineName('');
        setNewModelName('');
        setNewModelNumber('');
        // Append to DEFAULT_MACHINES and update UI
        DEFAULT_MACHINES = [...DEFAULT_MACHINES, newMachineName.trim()];
        setMachineList([...DEFAULT_MACHINES]);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: res.data.message || 'Please try again.',
        });
      }
    } catch (e) {
      let errorMsg = 'Please try again.';
      if (e && typeof e === 'object') {
        const err = e as any;
        errorMsg = err.response?.data?.message || err.message || errorMsg;
      }
      Toast.show({
        type: 'error',
        text1: 'Failed',
        text2: errorMsg,
      });
    }
  } else {
    Toast.show({
      type: 'error',
      text1: 'Missing Fields',
      text2: 'Please provide all machine info.',
    });
  }
};


  const handleAddMachineOption = () => {
    setAddingMachine(true);
  };

  // Dropdown modal content
  const renderDropdown = () => (
    <Modal animationType="slide" transparent visible={dropdownVisible} onRequestClose={() => setDropdownVisible(false)}>
      <View style={styles.dropdownOverlay}>
        <View style={styles.dropdownModal}>
          {addingMachine ? (
            <View style={styles.addMachineForm}>
              <Text style={styles.dropdownHeader}>Add Machine</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Machine Name"
                value={newMachineName}
                onChangeText={setNewMachineName}
                autoCapitalize="words"
              />
              <TextInput
                style={styles.formInput}
                placeholder="Model Name"
                value={newModelName}
                onChangeText={setNewModelName}
                autoCapitalize="words"
              />
              <TextInput
                style={styles.formInput}
                placeholder="Model Number"
                value={newModelNumber}
                onChangeText={setNewModelNumber}
                autoCapitalize="characters"
              />
              <TouchableOpacity style={styles.addBtn} onPress={handleAddMachine}>
                <Icon name="plus-circle" size={20} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.addBtnText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setAddingMachine(false)}>
                <Text style={styles.goBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={styles.dropdownHeader}>Select Machine</Text>
              <FlatList
                data={machineList}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setDropdownVisible(false);
                      Toast.show({
                        type: 'info',
                        text1: item,
                        text2: 'Machine selected',
                      });
                    }}
                  >
                    <Text style={{ color: '#232d3f' }}>{item}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={{ color: '#999', alignSelf: 'center', padding: 14 }}>
                    {fetchingMachines ? 'Loading machines...' : 'No machines available'}
                  </Text>
                }
                // Limit height of list to max 60% of screen height for scrollable
                style={{ maxHeight: '60%' }}
              />
              {(USER_ROLE === 'Management' || USER_ROLE === 'Service Head' || USER_ROLE === 'Engineer') && (
                <TouchableOpacity style={styles.dropdownItem} onPress={handleAddMachineOption}>
                  <Icon name="plus" size={18} color="#5C72A3" />
                  <Text style={{ marginLeft: 6, color: '#5C72A3', fontWeight: 'bold' }}>Add Machine</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.closeBtn} onPress={() => setDropdownVisible(false)}>
                <Text style={styles.goBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={openDrawer}>
            <Icon name="menu" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigation.navigate('Notifications')}>
            <Icon name="bell-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {/* Dashboard cards */}
          {dashboardItems.map((item, idx) => (
            <View style={styles.card} key={idx}>
              <View style={styles.circleIcon}>
                <Image source={item.icon} style={styles.cardLeftIcon} resizeMode="contain" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              </View>
              <Image source={item.rightIcon} style={styles.cardRightIcon} resizeMode="contain" />
            </View>
          ))}

          {/* KPI Section */}
          <Text style={styles.kpiHeader}>Key Performance Indicators</Text>

          {/* Add New Customer */}
          <View style={styles.kpiCard}>
            <View style={styles.kpiIconWrap}>
              <Image source={require('../assets/tabs/newCustomer.png')} style={styles.kpiIcon} resizeMode="contain" />
            </View>
            <Text style={styles.kpiText}>Add New Customer</Text>
            <TouchableOpacity
              style={[
                styles.goBtn,
                !(USER_ROLE === 'Management' || USER_ROLE === 'Service Head' || USER_ROLE === 'Engineer') && { opacity: 0.5 },
              ]}
              disabled={!(USER_ROLE === 'Management' || USER_ROLE === 'Service Head' || USER_ROLE === 'Engineer')}
              onPress={() => {
                if (USER_ROLE === 'Management' || USER_ROLE === 'Service Head' || USER_ROLE === 'Engineer') {
                  navigation.navigate('AddCustomer');
                }
              }}
            >
              <Text style={styles.goBtnText}>Go</Text>
            </TouchableOpacity>
          </View>

          {/* Add Machine */}
          <View style={styles.kpiCard}>
            <View style={styles.kpiIconWrap}>
              <Image source={require('../assets/tabs/machine.png')} style={styles.kpiIcon} resizeMode="contain" />
            </View>
            <Text style={styles.kpiText}>Add Machine</Text>
            <TouchableOpacity
              style={[
                styles.goBtn,
                !(USER_ROLE === 'Management' || USER_ROLE === 'Service Head' || USER_ROLE === 'Engineer') && { opacity: 0.5 },
              ]}
              disabled={!(USER_ROLE === 'Management' || USER_ROLE === 'Service Head' || USER_ROLE === 'Engineer')}
              onPress={() => {
                if (USER_ROLE === 'Management' || USER_ROLE === 'Service Head' || USER_ROLE === 'Engineer') {
                  setDropdownVisible(true);
                }
              }}
            >
              <Text style={styles.goBtnText}>Go</Text>
            </TouchableOpacity>
          </View>

          {renderDropdown()}

          {/* View Pending Tasks */}
          <View style={styles.kpiCard}>
            <View style={styles.kpiIconWrap}>
              <Image source={require('../assets/tabs/viewTask.png')} style={styles.kpiIcon} resizeMode="contain" />
            </View>
            <Text style={styles.kpiText}>View Pending Tasks</Text>
            <TouchableOpacity
              style={styles.goBtn}
              onPress={() => navigation.navigate('TasksScreen')}
            >
              <Text style={styles.goBtnText}>Go</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 18 }} />
        </ScrollView>

        <BottomTabs
          active={route.name}
          onTabPress={key => {
            if (route.name !== key) navigation.navigate(key as any);
          }}
        />
      </View>
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5C72A3',
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 2,
    elevation: 2,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  safeArea: { flex: 1, backgroundColor: '#F7F7FA' },
  container: { flex: 1, backgroundColor: '#F7F7FA' },
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
  headerIconBtn: { padding: 8, borderRadius: 8 },
  headerTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 20,
    letterSpacing: 0.2,
    textAlign: 'center',
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 13,
    paddingHorizontal: 14,
    paddingVertical: 13,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { height: 2, width: 0 },
    borderWidth: 1,
    borderColor: '#e3e7ed',
  },
  circleIcon: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: '#E3EAFD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  cardLeftIcon: { width: 34, height: 34 },
  cardRightIcon: { width: 28, height: 28 },
  cardTitle: { fontSize: 15.5, color: '#232D3F', fontWeight: 'bold', marginBottom: 2 },
  cardSubtitle: { fontSize: 12.5, color: '#9BA8C8' },
  kpiHeader: {
    fontSize: 16.5,
    color: '#212427',
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  kpiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 11,
    paddingHorizontal: 12,
    paddingVertical: 13,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { height: 1, width: 0 },
  },
  kpiIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 20,
    backgroundColor: '#E3EAFD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  kpiIcon: { width: 22, height: 22 },
  kpiText: { flex: 1, fontSize: 14.3, color: '#202B3C', fontWeight: '500', marginLeft: 1 },
  goBtn: { backgroundColor: '#5C72A3', paddingHorizontal: 19, paddingVertical: 6, borderRadius: 8 },
  goBtnText: { fontWeight: 'bold', color: '#fff', fontSize: 14 },
  dropdownOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.28)' },
  dropdownModal: { width: '80%', backgroundColor: '#fff', borderRadius: 12, padding: 18, elevation: 6, maxHeight: '70%' },
  dropdownHeader: { fontSize: 16, fontWeight: 'bold', marginBottom: 16, color: '#212427', textAlign: 'center' },
  dropdownItem: { padding: 12, flexDirection: 'row', alignItems: 'center' },
  addMachineForm: {},
  formInput: { borderBottomWidth: 1, borderColor: '#e3e7ed', marginBottom: 12, fontSize: 15, padding: 6 },
  closeBtn: { marginTop: 12, backgroundColor: '#5C72A3', paddingHorizontal: 19, paddingVertical: 6, borderRadius: 8, alignSelf: 'center' },
});
