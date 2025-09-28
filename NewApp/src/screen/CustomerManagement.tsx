import React, { useState, useEffect } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import BottomTabs from "../components/BottomTabs";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useAuth } from "../context/AuthContext";

const formatYYYYMMDD = (dateStr: string) => {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  try {
    const d = new Date(dateStr);
    return d.toISOString().split("T")[0];
  } catch {
    return dateStr;
  }
};

type Customer = {
  _id: string;
  name: string;
  phone: string;
  pendingAmount: number | string;
  dueDate?: string;
};

type EditCustomer = {
  _id: string;
  name: string;
  phone: string;
  pendingAmount: string;
  dueDate?: string;
};

const CustomerManagement: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const token = user?.token;

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<EditCustomer | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // Fetch all customers on mount
  const fetchAllCustomers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://192.168.10.142:5000/api/customer/all",
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (res.data && Array.isArray(res.data.customers)) {
        setCustomers(res.data.customers);
        setFilteredCustomers(res.data.customers);
      } else {
        setCustomers([]);
        setFilteredCustomers([]);
      }
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Fail",
        text2: "Could not load customers. Try again.",
      });
      setCustomers([]);
      setFilteredCustomers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllCustomers();
  }, []);

  // Search when query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCustomers(customers);
      return;
    }
    // use the API for searching
    const performSearch = async () => {
      try {
        const res = await axios.get(
          `http://192.168.10.142:5000/api/customer/search?q=${encodeURIComponent(
            searchQuery
          )}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        if (res.data && Array.isArray(res.data.customers)) {
          setFilteredCustomers(res.data.customers);
        } else {
          setFilteredCustomers([]);
        }
      } catch (e) {
        setFilteredCustomers([]);
      }
    };
    performSearch();
  }, [searchQuery, token]);

  // When a customer is selected, set edit model as well
  const handleSelectCustomer = (item: Customer) => {
    setSelectedCustomer(item);
    setEditingCustomer({
      _id: item._id,
      name: item.name || "",
      phone: item.phone || "",
      pendingAmount: typeof item.pendingAmount === "number"
        ? String(item.pendingAmount)
        : (item.pendingAmount || ""),
      dueDate: formatYYYYMMDD(item.dueDate || ""),
    });
    setEditing(false);
  };

  // Handle edit of fields
  const handleEditField = (field: keyof EditCustomer, value: string) => {
    setEditingCustomer((prev) =>
      prev ? { ...prev, [field]: value } : prev
    );
  };

  // Smart input formatting for due date
  const handleDueDateInput = (v: string) => {
    let val = v.replace(/[^0-9]/g, "");
    if (val.length > 8) val = val.slice(0, 8);
    let formatted = val;
    if (val.length > 4) formatted = val.slice(0, 4) + "-" + val.slice(4);
    if (val.length > 6) formatted = formatted.slice(0, 7) + "-" + formatted.slice(7);
    handleEditField("dueDate", formatted);
  };

  // Save edits to backend
  const handleSaveChanges = async () => {
    if (!editingCustomer) return;
    setSaving(true);
    try {
      const payload = {
        name: editingCustomer.name,
        phone: editingCustomer.phone,
        pendingAmount: editingCustomer.pendingAmount === "" ||
          isNaN(Number(editingCustomer.pendingAmount))
          ? 0
          : Number(editingCustomer.pendingAmount),
        dueDate: editingCustomer.dueDate,
      };
      const res = await axios.put(
        `http://192.168.10.142:5000/api/customer/${editingCustomer._id}`,
        payload,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (res.data && res.data.success) {
        Toast.show({
          type: "success",
          text1: "Customer details updated successfully",
        });
        await fetchAllCustomers();
        setEditing(false);
        setEditingCustomer((ec) =>
          ec
            ? {
                ...ec,
                name: payload.name,
                phone: payload.phone,
                pendingAmount: String(payload.pendingAmount),
                dueDate: payload.dueDate,
              }
            : ec
        );
        setSelectedCustomer((sc) =>
          sc && sc._id === editingCustomer._id
            ? { ...sc, ...payload }
            : sc
        );
      } else {
        Toast.show({
          type: "error",
          text1: "Update failed",
          text2: res.data?.message || "Try again. No changes were made or server error.",
        });
      }
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: "Update failed",
        text2: e.response?.data?.message || e.message || "Try again. Network/server error.",
      });
    }
    setSaving(false);
  };

  // Delete customer logic
  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;
    try {
      const res = await axios.delete(
        `http://192.168.10.142:5000/api/customer/${selectedCustomer._id}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (res.data && res.data.success) {
        Toast.show({
          type: "success",
          text1: "Customer deleted successfully",
        });
        setDeleteModal(false);
        setSelectedCustomer(null);
        setEditingCustomer(null);
        await fetchAllCustomers();
      } else {
        Toast.show({
          type: "error",
          text1: "Delete failed",
          text2: res.data?.message || "Try again. No changes made.",
        });
      }
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: "Delete failed",
        text2: e.response?.data?.message || e.message || "Try again.",
      });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Customer Management</Text>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search customers"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#888" style={{ marginTop: 32 }} />
        ) : (
          <>
            {selectedCustomer && (
              <View style={{
                alignSelf: "flex-end",
                marginRight: 24,
                marginBottom: 8,
                marginTop: 2,
                flexDirection: "row",
                alignItems: "center",
              }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#eee',
                    borderRadius: 16,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    marginRight: 2,
                  }}
                  onPress={() => { setSelectedCustomer(null); setEditingCustomer(null); setEditing(false); }}>
                  <Text style={{ color: '#2a68d8', fontWeight: 'bold' }}>Deselect</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginLeft: 8 }}
                  onPress={() => setDeleteModal(true)}
                >
                  <Icon name="trash-can" size={26} color="#e05a47" />
                </TouchableOpacity>
                <Modal
                  visible={deleteModal}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setDeleteModal(false)}
                >
                  <View style={styles.deleteModalOverlay}>
                    <View style={styles.deleteModalBox}>
                      <Text style={styles.deleteTitle}>Are you sure you want to delete this customer?</Text>
                      <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 22 }}>
                        <TouchableOpacity style={styles.modalBtn} onPress={() => setDeleteModal(false)}>
                          <Text style={styles.cancelBtnText}>No</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalBtn} onPress={handleDeleteCustomer}>
                          <Text style={styles.deleteBtnText}>Yes</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
                {!editing && (
                  <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => setEditing(true)}>
                    <Icon name="pencil" size={23} color="#165db2" />
                  </TouchableOpacity>
                )}
              </View>
            )}
            <FlatList
              data={filteredCustomers}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    style={[
                      styles.customerCard,
                      (selectedCustomer && selectedCustomer._id === item._id) && styles.customerCardSelected,
                    ]}
                    onPress={() => handleSelectCustomer(item)}
                  >
                    <Icon name="account" size={28} color="#555" />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.customerName}>{item.name}</Text>
                      <Text style={styles.customerPhone}>{item.phone}</Text>
                    </View>
                    {(selectedCustomer && selectedCustomer._id === item._id) && (
                      <Icon name="check-circle" size={22} color="#2a68d8" />
                    )}
                  </TouchableOpacity>
                );
              }}
              style={{ marginBottom: 18 }}
              ListEmptyComponent={
                <Text style={{
                  padding: 20,
                  alignSelf: "center",
                  color: "#666",
                  fontSize: 15,
                }}>
                  No customers found.
                </Text>
              }
            />
          </>
        )}

        {/* Edit Section */}
        {selectedCustomer && editingCustomer && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>
              Customer Info {editing && <Text style={{ color: "#888", fontSize: 13 }}>(edit mode)</Text>}
            </Text>
            <EditRow
              label="Name"
              value={editingCustomer.name}
              onChangeText={(v: string) => handleEditField("name", v)}
              editable={editing}
            />
            <EditRow
              label="Phone"
              value={editingCustomer.phone}
              onChangeText={(v: string) => handleEditField("phone", v)}
              keyboardType="phone-pad"
              editable={editing}
            />
            <EditRow
              label="Pending Dues"
              value={editingCustomer.pendingAmount}
              onChangeText={(v: string) => handleEditField("pendingAmount", v)}
              keyboardType="numeric"
              editable={editing}
            />
            <EditRow
              label="Due Date"
              value={editingCustomer.dueDate}
              onChangeText={handleDueDateInput}
              placeholder="YYYY-MM-DD"
              editable={editing}
              rightIcon={
                editing
                  ? {
                    name: "calendar",
                    onPress: () => setDatePickerVisible(true),
                  }
                  : undefined
              }
            />
            <DateTimePickerModal
              isVisible={editing && isDatePickerVisible}
              mode="date"
              date={editingCustomer.dueDate && editingCustomer.dueDate.length === 10 ? new Date(editingCustomer.dueDate) : new Date()}
              onConfirm={(date) => {
                handleEditField("dueDate", formatYYYYMMDD(date.toISOString().split("T")[0]));
                setDatePickerVisible(false);
              }}
              onCancel={() => setDatePickerVisible(false)}
            />
            {editing && (
              <View style={{ flexDirection: 'row', gap: 10, justifyContent: "flex-end" }}>
                <TouchableOpacity
                  style={[styles.saveButton, { backgroundColor: "#eee", marginRight: 10 }]}
                  onPress={() => { setEditing(false); handleSelectCustomer(selectedCustomer); }}
                >
                  <Text style={[styles.saveButtonText, { color: "#333" }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveButton, { opacity: saving ? 0.6 : 1 }]}
                  onPress={handleSaveChanges}
                  disabled={saving}
                >
                  <Text style={styles.saveButtonText}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Tabs fixed */}
      <View style={styles.bottomTabsWrapper}>
        <BottomTabs
          active={route.name}
          onTabPress={(key) => {
            if (route.name !== key) navigation.navigate(key as never);
          }}
        />
      </View>
      <Toast />
    </SafeAreaView>
  );
};

type EditRowProps = {
  label: string;
  value: string | undefined;
  onChangeText: (text: string) => void;
  keyboardType?: import("react-native").KeyboardTypeOptions;
  placeholder?: string;
  rightIcon?: {
    name: string;
    onPress: () => void;
  };
  editable?: boolean;
};

const EditRow: React.FC<EditRowProps> = ({
  label,
  value,
  onChangeText,
  keyboardType = "default",
  placeholder = "",
  rightIcon,
  editable = false,
}) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
      <TextInput
        style={[
          styles.infoValueInput,
          !editable && { backgroundColor: "#efefef", color: "#888", borderColor: "#e9e9e9" },
        ]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder={placeholder}
        editable={editable}
      />
      {rightIcon && editable && (
        <TouchableOpacity onPress={rightIcon.onPress} style={{ marginLeft: 8 }}>
          <Icon name={rightIcon.name} size={20} color="#2a68d8" />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 20,
    color: "#333",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 15,
  },
  customerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  customerCardSelected: {
    borderColor: "#2a68d8",
    borderWidth: 2,
  },
  customerName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  customerPhone: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
  },
  infoSection: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginTop: 6,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  infoValueInput: {
    fontSize: 14,
    color: "#333",
    backgroundColor: "#f8f8fb",
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#e3e7ed",
    paddingHorizontal: 9,
    flex: 1,
    marginLeft: 8,
    textAlign: "right",
  },
  saveButton: {
    backgroundColor: "#2a68d8",
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
    elevation: 1,
    minWidth: 120,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomTabsWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.13)",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteModalBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 28,
    marginHorizontal: 30,
    minWidth: 260,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.11,
    shadowRadius: 12,
    alignItems: "center",
  },
  deleteTitle: {
    fontSize: 16,
    color: "#2a284d",
    textAlign: "center",
    fontWeight: "700",
  },
  modalBtn: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 9,
    marginLeft: 8,
  },
  deleteBtnText: {
    color: "#dc3838",
    fontWeight: "bold",
    fontSize: 15,
  },
  cancelBtnText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default CustomerManagement;
