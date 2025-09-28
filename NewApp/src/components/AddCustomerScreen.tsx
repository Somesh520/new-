import { useAuth } from '../context/AuthContext';
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import axios from 'axios';

export default function AddCustomerScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const token = user?.token;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    pendingAmount: "",
    dueDate: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
    },
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleAddressChange = (field: string, value: string) => {
    setForm({
      ...form,
      address: { ...form.address, [field]: value },
    });
  };

  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.address.city ||
      !form.address.state
    ) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Please fill all required fields",
      });
      return;
    }

    setSubmitting(true);

    try {
      const payload: any = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        pendingAmount: Number(form.pendingAmount) || 0,
        address: form.address,
      };
      if (form.dueDate) payload.dueDate = form.dueDate;

      const res = await axios.post("http://192.168.10.142:5000/api/customer", payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.data && res.data.success) {
        Toast.show({
          type: "success",
          text1: "Customer Added",
          text2: res.data.message || "Customer has been added successfully!",
        });
        setTimeout(() => {
          navigation.goBack();
        }, 1200);
      } else {
        Toast.show({
          type: "error",
          text1: "Failed",
          text2: res.data && res.data.message ? res.data.message : "Try again.",
        });
      }
    } catch (e) {
      let errorMsg = "Try again.";
      if (typeof e === "object" && e !== null) {
        errorMsg = (e as any).response?.data?.message || (e as any).message || errorMsg;
      }
      Toast.show({
        type: "error",
        text1: "Failed",
        text2: errorMsg,
      });
    }
    setSubmitting(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Customer</Text>
        <View style={styles.headerIconBtn} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* FORM FIELDS */}
        <View style={styles.formCard}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter full name"
            value={form.name}
            onChangeText={text => handleChange('name', text)}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email"
            value={form.email}
            onChangeText={text => handleChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Phone *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            value={form.phone}
            onChangeText={text => handleChange('phone', text)}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Pending Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter pending amount"
            value={form.pendingAmount}
            onChangeText={text => handleChange('pendingAmount', text)}
            keyboardType="numeric"
          />

          <Text style={styles.sectionHeader}>Address</Text>

          <Text style={styles.label}>Street</Text>
          <TextInput
            style={styles.input}
            placeholder="Street address"
            value={form.address.street}
            onChangeText={text => handleAddressChange('street', text)}
          />

          <Text style={styles.label}>City *</Text>
          <TextInput
            style={styles.input}
            placeholder="City"
            value={form.address.city}
            onChangeText={text => handleAddressChange('city', text)}
          />

          <Text style={styles.label}>State *</Text>
          <TextInput
            style={styles.input}
            placeholder="State"
            value={form.address.state}
            onChangeText={text => handleAddressChange('state', text)}
          />

          <Text style={styles.label}>Zip Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Zip Code"
            value={form.address.zipCode}
            onChangeText={text => handleAddressChange('zipCode', text)}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Country</Text>
          <TextInput
            style={styles.input}
            placeholder="Country"
            value={form.address.country}
            onChangeText={text => handleAddressChange('country', text)}
          />

          {/* Due Date (optional) */}
          <Text style={styles.label}>Due Date (optional)</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="YYYY-MM-DD or select"
              value={form.dueDate}
              onChangeText={text => handleChange('dueDate', text)}
              keyboardType="default"
            />
            <TouchableOpacity
              style={{ marginLeft: 8, padding: 6 }}
              onPress={() => setShowDatePicker(true)}
            >
              <Icon name="calendar" size={22} color="#5C72A3" />
            </TouchableOpacity>
          </View>
          <DateTimePickerModal
            isVisible={showDatePicker}
            mode="date"
            onConfirm={date => {
              setShowDatePicker(false);
              // Format as YYYY-MM-DD
              const iso = date.toISOString();
              handleChange('dueDate', iso.split('T')[0]);
            }}
            onCancel={() => setShowDatePicker(false)}
          />
        </View>

        {/* SUBMIT BUTTON */}
        <TouchableOpacity
          style={[styles.submitBtn, { opacity: submitting ? 0.6 : 1 }]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
}




const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F7F7FA" },
  header: {
    backgroundColor: "#5C72A3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 56,
  },
  headerIconBtn: { padding: 6 },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { height: 1, width: 0 },
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#202B3C",
    marginTop: 12,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e3e7ed",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    fontSize: 14,
  },
  sectionHeader: {
    marginTop: 18,
    fontSize: 15,
    fontWeight: "bold",
    color: "#212427",
  },
  submitBtn: {
    backgroundColor: "#5C72A3",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});
