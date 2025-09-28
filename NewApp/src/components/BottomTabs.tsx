import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const iconMap = {
  Dashboard: "view-dashboard-outline",
 
  Customers: "account-group-outline",
  ServiceLogs: "cog-outline",
  MachineHistory: "wrench-outline",
  Notifications: "bell-outline",
};

const tabs = [
  { key: "HomeScreen", label: "Dashboard", icon: iconMap.Dashboard },
  { key: "Customers", label: "Customers", icon: iconMap.Customers },
  { key: "ServiceLogs", label: "Service Logs", icon: iconMap.ServiceLogs },
  { key: "MachineHistory", label: "Machine History", icon: iconMap.MachineHistory },
  { key: "Notifications", label: "Notifications", icon: iconMap.Notifications },
];

type Props = {
  active: string;
  onTabPress: (key: string) => void;
};

const BottomTabs: React.FC<Props> = ({ active, onTabPress }) => (
  <View style={styles.container}>
    {tabs.map((t) => {
      const isActive = t.key === active;
      return (
        <TouchableOpacity
          key={t.key}
          style={styles.tab}
          onPress={() => onTabPress(t.key)}
          activeOpacity={0.82}
        >
          <Icon
            name={t.icon}
            size={24}
            color={isActive ? "#5C72A3" : "#9BA8C8"}
          />
          <Text
            style={[
              styles.label,
              isActive && styles.labelActive
            ]}
            numberOfLines={1}
          >
            {t.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: 62,
    borderTopColor: "#D6DEED",
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D8DEEA",
    justifyContent: "space-between",
    elevation: 4,
    paddingBottom: Platform.OS === "ios" ? 8 : 0,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  label: {
    fontSize: 11,
    color: "#9AA9C1",
    fontWeight: "500",
    textAlign: "center",
    marginTop: 2,
  },
  labelActive: {
    color: "#22325B",
    fontWeight: "bold",
  },
});

export default BottomTabs;
