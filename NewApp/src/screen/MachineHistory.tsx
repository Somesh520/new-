// File picker using react-native-document-picker utility
// Must be inside the component to access state
import React, { useState } from 'react';
import {
  SafeAreaView, View, Text, TouchableOpacity, ScrollView, TextInput, Image, Modal,
  Platform, FlatList, StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import axios from 'axios';
import BottomTabs from '../components/BottomTabs';
import { useAuth } from '../context/AuthContext';

const MACHINE_SEARCH_ICON = require('../assets/tabs/machineSearch.png');

type Manual = {
  fileName?: string;
  name?: string;
  [key: string]: any;
};

type HistoryItem = {
  fileName?: string;
  name?: string;
  uploadedAt?: string;
  uploadedBy?: string;
  [key: string]: any;
};

type PickedFile = {
  uri: string;
  name: string;
  type?: string;
};

const MachineHistoryScreen = ({ openDrawer }: { openDrawer: () => void }) => {
  // ...existing code...
  // File picker functionality removed as per project cleanup.
  const handlePickFile = async () => {
    Toast.show({ type: 'error', text1: 'File picker removed from app.' });
  };
  const { user } = useAuth();
  const token = user?.token;

  const [searchSerial, setSearchSerial] = useState('');
  const [machineId, setMachineId] = useState<string | null>(null);
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showManuals, setShowManuals] = useState(false);
  const [showRecords, setShowRecords] = useState(false);
  const [showWarranty, setShowWarranty] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [pickedFile, setPickedFile] = useState<PickedFile | null>(null);
  const [uploading, setUploading] = useState(false);

  const checkAndRequestPermission = async () => {
    const perm = Platform.OS === 'android' ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE : PERMISSIONS.IOS.MEDIA_LIBRARY;
    let status = await check(perm);
    if (status === RESULTS.DENIED || status === RESULTS.BLOCKED) {
      status = await request(perm);
      if (status !== RESULTS.GRANTED && status !== RESULTS.LIMITED) {
        Toast.show({ type: 'error', text1: 'Please grant storage permission in app settings.' });
        openSettings();
        return false;
      }
    }
    return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
  };

  const handleSearch = async () => {
    if (!searchSerial.trim()) {
      Toast.show({ type: 'error', text1: 'Enter machine serial number' });
      return;
    }
    try {
      const res = await axios.get(
        `http://192.168.10.142:5000/api/machines/search?serial=${encodeURIComponent(searchSerial.trim())}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      if (res.data?.machines?.length) {
        setMachineId(res.data.machines[0]._id);
        fetchManuals(res.data.machines[0]._id);
        fetchHistory(res.data.machines[0]._id);
        Toast.show({ type: 'success', text1: 'Machine found.' });
      } else {
        setMachineId(null);
        setManuals([]);
        setHistory([]);
        Toast.show({ type: 'error', text1: 'No machine found.' });
      }
    } catch {
      setMachineId(null);
      Toast.show({ type: 'error', text1: 'Failed to search machine.' });
    }
  };

  const fetchManuals = async (id: string) => {
    try {
      const res = await axios.get(`http://192.168.10.142:5000/api/machines/${id}/manuals`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setManuals(res.data?.manuals || []);
    } catch {
      setManuals([]);
    }
  };

  const fetchHistory = async (id: string) => {
    try {
      const res = await axios.get(`http://192.168.10.142:5000/api/machines/${id}/manuals/history`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setHistory(res.data?.history || []);
    } catch {
      setHistory([]);
    }
  };

  // File picker functionality removed as per project cleanup.
  const openFilePicker = async () => {
    Toast.show({ type: 'error', text1: 'File picker removed from app.' });
  };

  const removePickedFile = () => setPickedFile(null);

  const handleUploadFile = async () => {
    if (!pickedFile || !machineId) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', {
        uri: pickedFile.uri,
        name: pickedFile.name,
        type: pickedFile.type || 'application/octet-stream',
      });
      const res = await axios.post(
        `http://192.168.10.142:5000/api/machines/${machineId}`,
        form,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (res.data && res.data.success) {
        Toast.show({ type: 'success', text1: 'Manual uploaded successfully' });
        setPickedFile(null);
        fetchManuals(machineId);
        fetchHistory(machineId);
      } else {
        Toast.show({ type: 'error', text1: 'Upload failed' });
      }
    } catch {
      Toast.show({ type: 'error', text1: 'Upload failed' });
    }
    setUploading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerCurve}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={openDrawer}>
            <Icon name="menu" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Machine History</Text>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Icon name="bell-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.searchWrap}>
          <Feather name="search" size={18} color="#26365F" style={{ marginRight: 7 }} />
          <TextInput
            placeholder="Enter Machine Serial No."
            style={styles.searchInput}
            placeholderTextColor="#ABB6C7"
            value={searchSerial}
            onChangeText={setSearchSerial}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity onPress={handleSearch}>
            <Image source={MACHINE_SEARCH_ICON} style={styles.searchRightIcon} resizeMode="contain" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.bodyContent}>
        <Text style={styles.detailsHeading}>Details</Text>

        <TouchableOpacity style={styles.accordionWarranty} onPress={() => setShowWarranty((v) => !v)}>
          <Text style={styles.warrantyTitle}>Warranty Information</Text>
          <Feather name={showWarranty ? 'chevron-up' : 'chevron-down'} size={23} color="#667292" />
        </TouchableOpacity>
        {showWarranty && <View style={styles.warrantyCard}><Text>Warranty details here...</Text></View>}

        <TouchableOpacity style={styles.accordion} onPress={() => setShowManuals((v) => !v)}>
          <Text style={styles.accordionLabel}>Uploaded Manuals</Text>
          <Feather name={showManuals ? 'chevron-up' : 'chevron-down'} size={22} color="#667292" />
        </TouchableOpacity>
        {showManuals && (
          <View style={styles.expandedContent}>
            {!manuals.length ? <Text>No manuals uploaded.</Text> : (
              <FlatList
                data={manuals}
                keyExtractor={(_, idx) => `manual${idx}`}
                renderItem={({ item }) => (
                  <View style={styles.fileItem}>
                    <Feather name="file-text" size={18} color="#4B5667" style={{ marginRight: 7 }} />
                    <Text style={styles.fileName}>{item.fileName || item.name}</Text>
                  </View>
                )}
              />
            )}
          </View>
        )}

        <TouchableOpacity style={styles.accordion} onPress={() => setShowRecords((v) => !v)}>
          <Text style={styles.accordionLabel}>Service Records</Text>
          <Feather name={showRecords ? 'chevron-up' : 'chevron-down'} size={22} color="#667292" />
        </TouchableOpacity>
        {showRecords && <View style={styles.expandedContent}><Text>No service records found.</Text></View>}

        <TouchableOpacity style={styles.accordion} onPress={() => setShowHistory((v) => !v)}>
          <Text style={styles.accordionLabel}>View History</Text>
          <Feather name={showHistory ? 'chevron-up' : 'chevron-down'} size={22} color="#667292" />
        </TouchableOpacity>
        {showHistory && (
          <View style={styles.expandedContent}>
            {!history.length ? <Text>No history.</Text> : (
              <FlatList
                data={history}
                keyExtractor={(_, idx) => `hist${idx}`}
                renderItem={({ item }) => (
                  <View style={styles.historyItem}>
                    <Feather name="file-text" size={17} color="#4B5667" style={{ marginRight: 8 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: 'bold', color: '#25325d' }}>{item.fileName || item.name}</Text>
                      <Text style={styles.historyDetail}>{`Uploaded on: ${item.uploadedAt ? new Date(item.uploadedAt).toLocaleString() : ''}`}</Text>
                      <Text style={styles.historyDetail}>{`Uploaded by: ${item.uploadedBy || 'Unknown'}`}</Text>
                    </View>
                  </View>
                )}
              />
            )}
          </View>
        )}

        <TouchableOpacity
          style={{
            backgroundColor: '#304A90',
            borderRadius: 6,
            alignSelf: 'center',
            paddingHorizontal: 18,
            paddingVertical: 7,
            marginTop: 10,
            marginBottom: 10,
          }}
          onPress={() => setUploadModal(true)}
          disabled={!machineId}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>+ Add Manual/Drawings</Text>
        </TouchableOpacity>

        <Modal visible={uploadModal} transparent animationType="fade" onRequestClose={() => setUploadModal(false)}>
          <View style={styles.uploadModalOverlay}>
            <View style={styles.uploadModalBox}>
              <Text style={styles.uploadTitle}>Choose File Source</Text>
              <View style={{ flexDirection: 'row', marginTop: 12 }}>
                <TouchableOpacity style={styles.uploadOption} onPress={handlePickFile}>
                  <Feather name="folder" size={23} color="#4B5667" />
                  <Text style={styles.uploadOptionText}>File Manager</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.uploadOption} onPress={handlePickFile}>
                  <Feather name="cloud" size={23} color="#4B5667" />
                  <Text style={styles.uploadOptionText}>Google Drive</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => setUploadModal(false)}>
                <Text style={{ color: '#ba2323', fontWeight: 'bold', marginTop: 12, fontSize: 15 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {pickedFile && (
          <View style={styles.pickedDocumentBar}>
            <Feather name="file-text" size={19} color="#304A90" style={{ marginRight: 8 }} />
            <Text style={styles.pickedDocName}>{pickedFile.name}</Text>
            <TouchableOpacity onPress={removePickedFile} style={{ marginLeft: 8 }}>
              <Feather name="x" size={18} color="#dc3838" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.uploadDocBtn} onPress={handleUploadFile} disabled={uploading}>
              <Text style={styles.uploadDocBtnText}>{uploading ? 'Uploading...' : 'Upload'}</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={{ height: 18 }} />
      </ScrollView>
      <BottomTabs active={'Machine History'} onTabPress={() => {}} />
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7FA' },
  headerCurve: {
    backgroundColor: '#5C72A3',
    paddingBottom: 30,
    borderBottomLeftRadius: 75,
    borderBottomRightRadius: 75,
    marginBottom: 7,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    marginTop: 10,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 21,
    letterSpacing: 0.12,
    textAlign: 'center',
    flex: 1,
  },
  headerIconBtn: {
    padding: 3,
  },
  searchWrap: {
    backgroundColor: '#F3F5F6',
    marginHorizontal: 20,
    borderRadius: 13,
    marginTop: 19,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#9CA5C3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    paddingLeft: 7,
    paddingRight: 5,
    height: 40,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14.6,
    color: '#353535',
    paddingVertical: 0,
    paddingRight: 2,
  },
  searchRightIcon: {
    width: 22,
    height: 22,
    marginLeft: 7,
  },
  bodyContent: {
    paddingHorizontal: 14,
    paddingTop: 4,
    paddingBottom: 26,
  },
  detailsHeading: {
    fontWeight: 'bold',
    color: '#222831',
    fontSize: 18,
    marginTop: 14,
    marginBottom: 11,
    letterSpacing: 0.18,
  },
  accordionWarranty: {
    backgroundColor: '#E6E8EC',
    borderRadius: 7,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    justifyContent: 'space-between',
    elevation: 1,
  },
  warrantyTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#394050',
  },
  warrantyCard: {
    backgroundColor: '#E6E8EC',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    marginTop: -6,
    elevation: 0.7,
  },
  accordion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#CDD5E1',
    borderRadius: 8,
    paddingVertical: 13,
    paddingHorizontal: 14,
    marginBottom: 10,
    marginTop: 3,
    elevation: 1,
  },
  accordionLabel: {
    fontWeight: '500',
    fontSize: 15,
    color: '#4B5667',
  },
  expandedContent: {
    backgroundColor: '#EBEEF4',
    padding: 9,
    marginBottom: 7,
    borderRadius: 8,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 0.5,
    borderBottomColor: '#d2dbe7',
  },
  fileName: {
    fontSize: 14,
    color: '#25325d',
  },
  uploadModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(105,110,126,0.17)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadModalBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 22,
    paddingVertical: 26,
    minWidth: 250,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 7,
    elevation: 10,
    alignItems: 'center',
  },
  uploadTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#25325d',
  },
  uploadOption: {
    backgroundColor: '#ebf0fa',
    marginHorizontal: 8,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadOptionText: {
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#25325d',
    fontSize: 15,
  },
  pickedDocumentBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ebf0fa',
    paddingVertical: 7,
    borderRadius: 11,
    margin: 11,
    paddingHorizontal: 11,
  },
  pickedDocName: {
    color: '#304A90',
    fontWeight: 'bold',
    fontSize: 14,
    flex: 1,
  },
  uploadDocBtn: {
    backgroundColor: '#304A90',
    borderRadius: 6,
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingVertical: 7,
    marginLeft: 10,
  },
  uploadDocBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.6,
    borderBottomColor: '#dee1ee',
  },
  historyDetail: {
    fontSize: 13,
    color: '#888',
    marginTop: 1,
  },
});

export default MachineHistoryScreen;
