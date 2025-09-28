import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';

interface RoleDropdownProps {
  selectedRole: string;
  onRoleSelect: (role: string) => void;
}

const roles = [
  'Management',
  'Service Head',
  'Engineer',
  'Sales',
];

const RoleDropdown = ({ selectedRole, onRoleSelect }: RoleDropdownProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleRoleSelect = (role: string) => {
    onRoleSelect(role);
    setIsVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.dropdownContainer}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.dropdownText}>
          {selectedRole === 'Choose either Engineer or Manager' ? 'Select your role' : selectedRole}
        </Text>
        <Text style={styles.dropdownArrow}>⌄</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={isVisible}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={roles}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.roleOption}
                  onPress={() => handleRoleSelect(item)}
                >
                  <Text style={styles.roleText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 55,
    elevation: 3,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 18,
    color: '#0D2C54',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '80%',
    maxHeight: '50%',
    elevation: 10,
  },
  roleOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  roleText: {
    fontSize: 16,
    color: '#333',
  },
});

export default RoleDropdown;