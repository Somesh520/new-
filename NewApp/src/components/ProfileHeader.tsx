// src/components/ProfileHeader.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = Math.round(width * 0.45);

const ProfileHeader: React.FC<{
  onBack?: () => void;
  avatar: any;
  title: string;
  subtitle?: string;
}> = ({ onBack, avatar, title, subtitle }) => {
  return (
    <View style={styles.headerWrap}>
      <View style={styles.curve} />

      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Text style={styles.backText}>‹</Text>
      </TouchableOpacity>

      <View style={styles.avatarWrap}>
        <Image source={avatar} style={styles.avatar} />
      </View>

      <View style={styles.titleWrap}>
        <Text style={styles.titleText}>{title}</Text>
        {subtitle ? <Text style={styles.subText}>{subtitle}</Text> : null}
      </View>
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  headerWrap: {
    height: HEADER_HEIGHT,
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 24,
  },
  curve: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT * 0.8,
    backgroundColor: "#2857A3", // blue gradient look (single color)
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    transform: [{ scaleX: 1.2 }],
  },
  backBtn: {
    position: "absolute",
    left: 12,
    top: 12,
    padding: 6,
  },
  backText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
  },
  avatarWrap: {
    marginTop: HEADER_HEIGHT * 0.12,
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 116,
    height: 116,
    borderRadius: 116 / 2,
    borderWidth: 4,
    borderColor: "#fff",
    backgroundColor: "#ddd",
  },
  titleWrap: {
    marginTop: 10,
    alignItems: "center",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  subText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
});
