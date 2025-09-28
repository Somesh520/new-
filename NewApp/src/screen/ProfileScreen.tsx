import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  Platform,
  Modal,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../context/AuthContext";

const windowWidth = Dimensions.get("window").width;

const AVATAR_SIZE = 120;
const WAVE_HEIGHT = 170;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  // Use user from AuthContext directly
  const name = user?.name || "Guest User";
  const email = user?.email || "No email available";
  const role = user?.role || "Guest";
  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Removed useEffect and fakeFetchUserByEmail. All data comes from AuthContext.

  const handleSaveChanges = async () => {
    try {
      console.log("Saving changes:", { name, role, email });
      setIsEditing(false);
    } catch (error) {
      console.log("Error saving changes:", error);
    }
  };

  const handleLogout = () => {
    setModalVisible(false);
    logout();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerContainer}>
        <Svg
          height={Platform.OS === "ios" ? "190" : "170"}
          width={windowWidth}
          viewBox="0 0 1440 320"
          style={styles.curve}
        >
          <Path
            fill="#254387"
            d="M0,64L48,80C96,96,192,128,288,149.3C384,171,480,181,576,176C672,171,768,149,864,144C960,139,1056,149,1152,160C1248,171,1344,181,1392,186.7L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </Svg>

        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        {/* Profile avatar */}
        <View style={styles.avatarWrapper}>
          <Image
            source={require("../assets/images/default-avatar.png")}
            style={styles.avatar}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Name + Email */}
        <Text style={styles.nameText}>{name}</Text>
        <Text style={styles.emailText}>{email}</Text>

        {/* Buttons */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => setIsEditing(!isEditing)}
            activeOpacity={0.7}
          >
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadBtn} activeOpacity={0.7}>
            <Text style={styles.uploadBtnText}>Upload Pic</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              editable={false}
              placeholder="Enter name"
              placeholderTextColor="#999"
            />

          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={[styles.input, styles.readonly]}
            value={email}
            editable={false}
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Role</Text>
            <TextInput
              style={styles.input}
              value={role}
              editable={false}
              placeholder="Enter role"
              placeholderTextColor="#999"
            />
        </View>

        {/* Save button */}
        {isEditing && (
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSaveChanges}
            activeOpacity={0.8}
          >
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
        )}

        {/* Logout button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="logout"
            size={20}
            color="#203145"
            style={styles.logoutIcon}
          />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Logout confirmation modal */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Are you sure?</Text>
            <Text style={styles.modalMessage}>
              Do you really want to log out?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalYesBtn}
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <Text style={styles.modalYesText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalNoBtn}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalNoText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  headerContainer: {
    backgroundColor: "#254387",
    alignItems: "center",
    position: "relative",
    height: WAVE_HEIGHT + AVATAR_SIZE / 2,
    marginBottom: AVATAR_SIZE / 2,
  },
  curve: {
    position: "absolute",
    top: 0,
    left: 0,
    width: windowWidth,
    height: WAVE_HEIGHT + 50,
  },
  backButton: { position: "absolute", top: 40, left: 20, zIndex: 20 },

  avatarWrapper: {
    position: "absolute",
    bottom: -AVATAR_SIZE / 2,
    alignSelf: "center",
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  avatar: {
    width: AVATAR_SIZE - 8,
    height: AVATAR_SIZE - 8,
    borderRadius: (AVATAR_SIZE - 8) / 2,
    resizeMode: "cover",
  },

  scrollContent: { paddingBottom: 40, flexGrow: 1 },

  nameText: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 8,
    color: "#203145",
    textAlign: "center",
  },
  emailText: {
    fontSize: 14,
    color: "#6e7f91",
    textAlign: "center",
    marginBottom: 8,
  },

  buttonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 15,
  },
  editBtn: {
    backgroundColor: "#232323",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 22,
    marginRight: 10,
  },
  editBtnText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  uploadBtn: {
    backgroundColor: "#e5e5e5",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 22,
  },
  uploadBtnText: { color: "#000", fontSize: 14, fontWeight: "600" },

  form: { paddingHorizontal: 22, marginTop: 10 },
  label: {
    color: "#203145",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 14,
  },
  input: {
    backgroundColor: "#f4f6f9",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 6,
    fontSize: 14,
    color: "#000",
  },
  readonly: { color: "#6e7f91" },

  saveBtn: {
    backgroundColor: "#254387",
    marginHorizontal: 22,
    marginTop: 20,
    padding: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#f4f6f9",
    marginHorizontal: 22,
  },
  logoutIcon: { marginRight: 6 },
  logoutText: {
    color: "#203145",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 6,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.22)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#254387",
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  modalTitle: {
    fontSize: 20,
    color: "#254387",
    fontWeight: "700",
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: "#232D3F",
    textAlign: "center",
    marginBottom: 18,
    marginTop: 2,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  modalYesBtn: {
    backgroundColor: "#254387",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 28,
    marginRight: 12,
  },
  modalYesText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  modalNoBtn: {
    backgroundColor: "#f4f6f9",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 28,
    marginLeft: 12,
  },
  modalNoText: {
    color: "#232D3F",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default ProfileScreen;
