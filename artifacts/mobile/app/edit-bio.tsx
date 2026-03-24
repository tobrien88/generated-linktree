import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AI_BIO =
  "Chasing sunsets & street food across 40+ countries. Content creator, travel guide author, and certified coffee snob. She/her.";

const MAX_BIO = 160;

export default function EditBioScreen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("Nova Reyes");
  const [bio, setBio] = useState(AI_BIO);
  const [bioFocused, setBioFocused] = useState(false);

  const tryAgainBios = [
    "Wanderlust-driven creator turning adventures into content. 40+ countries, one lens at a time. Travel tips, reels & real talk.",
    "Perpetual traveler, storyteller, and street food enthusiast. Helping you explore the world one post at a time. She/her.",
    "Creating the travel content I wish existed. 40+ countries, 0 regrets. Guides, vlogs & the occasional coffee obsession.",
  ];
  const [tryIdx, setTryIdx] = useState(0);

  const handleTryAgain = () => {
    const next = (tryIdx + 1) % tryAgainBios.length;
    setTryIdx(next);
    setBio(tryAgainBios[next]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) }]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
            <Feather name="chevron-left" size={22} color="#7B3FE4" />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Add profile details</Text>
            <Text style={styles.headerSub}>Add your profile image, name, and bio.</Text>
          </View>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <Image
                source={require("../assets/images/nova-avatar.png")}
                style={styles.avatar}
                contentFit="cover"
              />
              <Pressable style={styles.avatarAddBtn}>
                <Feather name="plus" size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>

          {/* AI tag */}
          <View style={styles.aiTag}>
            <Feather name="zap" size={12} color="#7B3FE4" />
            <Text style={styles.aiTagText}>AI generated your profile details from your social data</Text>
          </View>

          {/* Display Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Display Name</Text>
            <TextInput
              style={styles.fieldInput}
              value={name}
              onChangeText={setName}
              placeholder="Your display name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Bio */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Bio</Text>
            <View style={[styles.bioWrapper, bioFocused && styles.bioWrapperFocused]}>
              <TextInput
                style={styles.bioInput}
                value={bio}
                onChangeText={(t) => setBio(t.slice(0, MAX_BIO))}
                onFocus={() => setBioFocused(true)}
                onBlur={() => setBioFocused(false)}
                placeholder="Tell the world what you're about"
                placeholderTextColor="#9CA3AF"
                multiline
                maxLength={MAX_BIO}
              />
              <Text style={styles.charCount}>
                {bio.length}/{MAX_BIO}
              </Text>
            </View>
          </View>

          {/* Try Again */}
          <View style={styles.tryAgainSection}>
            <Text style={styles.tryAgainHint}>
              Need inspiration? Let AI regenerate your bio.
            </Text>
            <Pressable
              style={({ pressed }) => [styles.tryAgainBtn, pressed && { opacity: 0.85 }]}
              onPress={handleTryAgain}
            >
              <Feather name="refresh-cw" size={15} color="#7B3FE4" />
              <Text style={styles.tryAgainText}>Try again</Text>
            </Pressable>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16) }]}>
          <Pressable
            style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.85 }]}
            onPress={() => router.back()}
          >
            <Text style={styles.saveBtnText}>Save profile details</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: { width: 36, alignItems: "center" },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Inter_700Bold",
  },
  headerSub: {
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  skipText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontFamily: "Inter_500Medium",
    width: 36,
    textAlign: "right",
  },
  content: { paddingHorizontal: 20, paddingTop: 16 },
  avatarSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatarWrapper: {
    position: "relative",
    width: 96,
    height: 96,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarAddBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  aiTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0E8FF",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
  },
  aiTagText: {
    flex: 1,
    fontSize: 12,
    color: "#7B3FE4",
    fontFamily: "Inter_500Medium",
    lineHeight: 17,
  },
  fieldGroup: { marginBottom: 16 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    fontFamily: "Inter_600SemiBold",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fieldInput: {
    backgroundColor: "#F8F7F5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1A1A1A",
    fontFamily: "Inter_500Medium",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  bioWrapper: {
    backgroundColor: "#F8F7F5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  bioWrapperFocused: {
    borderColor: "#7B3FE4",
    backgroundColor: "#FFFFFF",
  },
  bioInput: {
    fontSize: 15,
    color: "#1A1A1A",
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    minHeight: 80,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: "Inter_400Regular",
    textAlign: "right",
    marginTop: 6,
  },
  tryAgainSection: {
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  tryAgainHint: {
    fontSize: 13,
    color: "#9CA3AF",
    fontFamily: "Inter_400Regular",
  },
  tryAgainBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1.5,
    borderColor: "#7B3FE4",
    backgroundColor: "#F0E8FF",
  },
  tryAgainText: {
    fontSize: 15,
    color: "#7B3FE4",
    fontFamily: "Inter_600SemiBold",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  saveBtn: {
    backgroundColor: "#1D3C34",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
  },
});
