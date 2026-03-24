import { Feather, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NOVA_BIO =
  "Chasing sunsets & street food across 40+ countries. Content creator, travel guide author, and certified coffee snob. She/her.";

const NOVA_LINKS = [
  {
    id: "guide",
    title: "Free SE Asia Travel Guide",
    subtitle: "Download now — 80 pages of tips",
    featured: false,
  },
  {
    id: "tiktok",
    title: "Follow me on TikTok",
    subtitle: "@novaonthemove · 284K followers",
    featured: true,
  },
  {
    id: "presets",
    title: "My Lightroom Preset Pack",
    subtitle: "The filters I use in every reel",
    featured: false,
  },
  {
    id: "youtube",
    title: "Watch my travel vlogs",
    subtitle: "YouTube · @NovaOnTheMove",
    featured: false,
  },
  {
    id: "website",
    title: "novaonthemove.com",
    subtitle: "My full blog & travel resources",
    featured: false,
  },
];

const RATIONALE = [
  {
    key: "theme",
    icon: "droplet" as const,
    label: "Warm terracotta theme",
    reason: "Matched to your earthy, sun-soaked Instagram aesthetic",
    color: "#C9614A",
  },
  {
    key: "bio",
    icon: "edit-3" as const,
    label: "Travel-focused bio",
    reason: "Written from your most-used content topics across all platforms",
    color: "#7B3FE4",
  },
  {
    key: "tiktok",
    icon: "trending-up" as const,
    label: "TikTok featured first",
    reason: "Your fastest-growing platform — 284K followers, 38% engagement",
    color: "#E1306C",
  },
  {
    key: "guide",
    icon: "gift" as const,
    label: "Free guide as top link",
    reason: "Your most-clicked content type drives 3x more engagement",
    color: "#22C55E",
  },
];

export default function AIPreviewScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.sparkleRow}>
          <Feather name="zap" size={14} color="#7B3FE4" />
          <Text style={styles.sparkleLabel}>AI-Generated</Text>
        </View>
        <Text style={styles.headerTitle}>Your Linktree is ready</Text>
        <Text style={styles.headerSub}>
          Built from your social signals. Tap below to customize.
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Phone mockup card */}
        <View style={styles.mockupCard}>
          <LinearGradient
            colors={["#C9614A", "#E8A87C", "#F5C89A"]}
            style={styles.mockupGradient}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
          >
            <Text style={styles.mockupLogo}>*</Text>
            <View style={styles.avatarContainer}>
              <Image
                source={require("../assets/images/nova-avatar.png")}
                style={styles.avatar}
                contentFit="cover"
              />
            </View>
            <Text style={styles.mockupHandle}>@novaonthemove</Text>
            <Text style={styles.mockupBio} numberOfLines={3}>{NOVA_BIO}</Text>
            <View style={styles.socialRow}>
              <MaterialCommunityIcons name="instagram" size={20} color="rgba(255,255,255,0.9)" />
              <MaterialCommunityIcons name="music-note" size={20} color="rgba(255,255,255,0.9)" />
              <FontAwesome5 name="youtube" size={18} color="rgba(255,255,255,0.9)" />
              <FontAwesome5 name="spotify" size={18} color="rgba(255,255,255,0.9)" />
            </View>
            {NOVA_LINKS.map((link) => (
              <View key={link.id} style={[
                styles.miniLink,
                link.featured && styles.miniLinkFeatured,
              ]}>
                <Text style={[styles.miniLinkText, link.featured && styles.miniLinkTextFeatured]}>
                  {link.title}
                </Text>
              </View>
            ))}
          </LinearGradient>
        </View>

        {/* Edit actions */}
        <View style={styles.editRow}>
          <Pressable
            style={({ pressed }) => [styles.editBtn, pressed && { opacity: 0.8 }]}
            onPress={() => router.push("/modify-theme")}
          >
            <Feather name="droplet" size={16} color="#7B3FE4" />
            <Text style={styles.editBtnText}>Edit theme</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.editBtn, pressed && { opacity: 0.8 }]}
            onPress={() => router.push("/edit-bio")}
          >
            <Feather name="edit-3" size={16} color="#7B3FE4" />
            <Text style={styles.editBtnText}>Edit bio/links</Text>
          </Pressable>
        </View>

        {/* Rationale section */}
        <View style={styles.rationaleSection}>
          <Text style={styles.rationaleTitle}>Why AI chose this</Text>
          <Text style={styles.rationaleSub}>Every choice is based on your actual social data</Text>
          <View style={styles.rationaleList}>
            {RATIONALE.map((r) => (
              <View key={r.key} style={styles.rationaleItem}>
                <View style={[styles.rationaleIcon, { backgroundColor: r.color + "22" }]}>
                  <Feather name={r.icon} size={15} color={r.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rationaleLabel}>{r.label}</Text>
                  <Text style={styles.rationaleReason}>{r.reason}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16) }]}>
        <Pressable
          style={({ pressed }) => [styles.continueBtn, pressed && { opacity: 0.85 }]}
          onPress={() => router.push("/monetization")}
        >
          <Text style={styles.continueBtnText}>Continue building this Linktree</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: { paddingHorizontal: 20, paddingBottom: 0, paddingTop: 12, gap: 4 },
  sparkleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 4,
  },
  sparkleLabel: {
    fontSize: 12,
    color: "#7B3FE4",
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Inter_700Bold",
  },
  headerSub: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16 },
  mockupCard: {
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#C9614A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  mockupGradient: {
    padding: 20,
    alignItems: "center",
    gap: 8,
  },
  mockupLogo: {
    fontSize: 20,
    color: "rgba(255,255,255,0.8)",
    fontFamily: "Inter_700Bold",
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    overflow: "hidden",
    marginBottom: 4,
  },
  avatar: { width: 72, height: 72 },
  mockupHandle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
  },
  mockupBio: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 17,
    paddingHorizontal: 10,
  },
  socialRow: {
    flexDirection: "row",
    gap: 14,
    marginVertical: 4,
  },
  miniLink: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  miniLinkFeatured: {
    backgroundColor: "rgba(255,255,255,0.38)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.6)",
  },
  miniLinkText: {
    fontSize: 13,
    color: "#FFFFFF",
    fontFamily: "Inter_500Medium",
  },
  miniLinkTextFeatured: { fontFamily: "Inter_700Bold" },
  editRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  editBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 12,
    paddingVertical: 12,
    backgroundColor: "#F0E8FF",
    borderWidth: 1,
    borderColor: "#DDD0FF",
  },
  editBtnText: {
    fontSize: 14,
    color: "#7B3FE4",
    fontFamily: "Inter_600SemiBold",
  },
  rationaleSection: { marginTop: 24 },
  rationaleTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  rationaleSub: {
    fontSize: 13,
    color: "#9CA3AF",
    fontFamily: "Inter_400Regular",
    marginBottom: 16,
  },
  rationaleList: { gap: 10 },
  rationaleItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "#F8F7F5",
    borderRadius: 14,
    padding: 14,
  },
  rationaleIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rationaleLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Inter_600SemiBold",
    marginBottom: 2,
  },
  rationaleReason: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
  },
  footer: { paddingHorizontal: 20, paddingTop: 12 },
  continueBtn: {
    backgroundColor: "#7B3FE4",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
  },
});
