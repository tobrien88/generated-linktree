import { Feather, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  ImageBackground,
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
    subtitle: "80 pages of tips",
    thumbnail: require("../assets/images/monkey-thai-market.png"),
    iconName: null,
    iconColor: "#22C55E",
  },
  {
    id: "tiktok",
    title: "Follow me on TikTok",
    subtitle: "@novaonthemove · 284K",
    thumbnail: null,
    iconName: "music-note" as const,
    iconColor: "#E1306C",
    featured: true,
  },
  {
    id: "presets",
    title: "My Lightroom Preset Pack",
    subtitle: "Filters from every reel",
    thumbnail: null,
    iconName: "camera" as const,
    iconColor: "#7B3FE4",
  },
  {
    id: "youtube",
    title: "Watch my travel vlogs",
    subtitle: "YouTube · @NovaOnTheMove",
    thumbnail: null,
    iconName: "play-circle" as const,
    iconColor: "#FF0000",
  },
];

const RATIONALE = [
  {
    key: "theme",
    icon: "droplet" as const,
    label: "SE Asia photo theme",
    reason: "Matched to your earthy, sun-soaked Instagram aesthetic",
    color: "#22C55E",
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
    color: "#F59E0B",
  },
];

function ProLinkButton({ link }: { link: typeof NOVA_LINKS[0] }) {
  return (
    <View style={[styles.proLink, link.featured && styles.proLinkFeatured]}>
      {link.thumbnail ? (
        <Image
          source={link.thumbnail}
          style={styles.linkThumb}
          contentFit="cover"
        />
      ) : (
        <View style={[styles.linkIconBox, { backgroundColor: (link.iconColor ?? "#888") + "28" }]}>
          <MaterialCommunityIcons
            name={(link.iconName as "camera") ?? "link"}
            size={16}
            color={link.iconColor ?? "#888"}
          />
        </View>
      )}
      <Text style={styles.proLinkText} numberOfLines={1}>{link.title}</Text>
      <Text style={styles.linkDots}>•••</Text>
    </View>
  );
}

export default function AIPreviewScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) }]}>
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
        {/* Pro mockup card */}
        <View style={styles.mockupCard}>
          <ImageBackground
            source={require("../assets/images/se-asia-bg.png")}
            style={styles.mockupBg}
            imageStyle={styles.mockupBgImage}
          >
            <LinearGradient
              colors={["rgba(0,0,0,0.05)", "rgba(10,38,26,0.52)", "rgba(6,28,18,0.93)"]}
              style={styles.mockupGradient}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            >
              <Text style={styles.mockupLogo}>✳</Text>

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
                <MaterialCommunityIcons name="instagram" size={18} color="rgba(255,255,255,0.85)" />
                <MaterialCommunityIcons name="music-note" size={18} color="rgba(255,255,255,0.85)" />
                <FontAwesome5 name="youtube" size={16} color="rgba(255,255,255,0.85)" />
                <FontAwesome5 name="spotify" size={16} color="rgba(255,255,255,0.85)" />
              </View>

              <View style={styles.linkList}>
                {NOVA_LINKS.map((link) => (
                  <ProLinkButton key={link.id} link={link} />
                ))}
              </View>
            </LinearGradient>
          </ImageBackground>
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
          <Text style={styles.rationaleTitle}>Why we selected this</Text>
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
    shadowColor: "#0A2A1A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 10,
  },
  mockupBg: { width: "100%" },
  mockupBgImage: { borderRadius: 24 },
  mockupGradient: {
    padding: 18,
    paddingBottom: 22,
    alignItems: "center",
    gap: 6,
    minHeight: 420,
  },
  mockupLogo: {
    fontSize: 18,
    color: "rgba(255,255,255,0.75)",
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
    fontSize: 19,
    color: "#FFFFFF",
    fontFamily: "Quicksand_700Bold",
    letterSpacing: 0.3,
  },
  mockupBio: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 16,
    paddingHorizontal: 14,
  },
  socialRow: {
    flexDirection: "row",
    gap: 14,
    marginVertical: 2,
  },
  linkList: {
    width: "100%",
    gap: 8,
    marginTop: 4,
  },

  proLink: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.93)",
    borderRadius: 50,
    paddingVertical: 7,
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
    gap: 9,
  },
  proLinkFeatured: {
    backgroundColor: "#FFFFFF",
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 6,
  },
  linkThumb: {
    width: 38,
    height: 38,
    borderRadius: 10,
    flexShrink: 0,
  },
  linkIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  proLinkText: {
    flex: 1,
    fontSize: 12,
    color: "#1A1A1A",
    fontFamily: "Inter_600SemiBold",
  },
  linkDots: {
    fontSize: 10,
    color: "#9CA3AF",
    letterSpacing: 1,
    paddingRight: 4,
  },

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
