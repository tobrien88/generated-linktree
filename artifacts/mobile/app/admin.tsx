import { Feather, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useOnboarding } from "@/context/OnboardingContext";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.65;

const TIER_COLORS = {
  free: { bg: "#F8F7F5", card: "#FFFFFF", accent: "#6B7280" },
  starter: { bg: "#FBF0E9", card: "#FFFFFF", accent: "#C9614A" },
  pro: { bg: "#F8F7FF", card: "#FFFFFF", accent: "#7B3FE4" },
  premium: { bg: "#FFFBEB", card: "#FFFFFF", accent: "#B8860B" },
};

const CHECKLIST = [
  { id: "profile", label: "Add profile image", done: true },
  { id: "theme", label: "Pick a theme", done: true },
  { id: "links", label: "Add links", done: true },
  { id: "bio", label: "Write your bio", done: true },
  { id: "connect", label: "Connect social accounts", done: true },
  { id: "share", label: "Share your Linktree", done: false },
];

const NOVA_LINKS = [
  {
    id: "guide",
    title: "Free SE Asia Travel Guide",
    icon: "book-open" as const,
    clicks: 324,
    toggled: true,
    color: "#22C55E",
  },
  {
    id: "tiktok",
    title: "Follow on TikTok",
    icon: "music-note",
    clicks: 892,
    toggled: true,
    color: "#000000",
    isMaterial: true,
  },
  {
    id: "presets",
    title: "Lightroom Preset Pack",
    icon: "sliders" as const,
    clicks: 196,
    toggled: true,
    color: "#F59E0B",
  },
  {
    id: "youtube",
    title: "Watch my vlogs",
    icon: "youtube",
    clicks: 441,
    toggled: true,
    color: "#FF0000",
    isFontAwesome: true,
  },
  {
    id: "website",
    title: "novaonthemove.com",
    icon: "globe" as const,
    clicks: 267,
    toggled: true,
    color: "#7B3FE4",
  },
];

const SHARE_DESTINATIONS = [
  { id: "linktree", label: "My Linktree", icon: "external-link" as const, iconType: "feather" },
  { id: "qr", label: "QR Code", icon: "maximize" as const, iconType: "feather" },
  { id: "digital-card", label: "Digital card", icon: "credit-card" as const, iconType: "feather", isNew: true },
  { id: "tiktok", label: "TikTok", icon: "music-note", iconType: "material" },
  { id: "facebook", label: "Facebook", icon: "facebook" as const, iconType: "fontawesome" },
  { id: "x", label: "X", icon: "twitter" as const, iconType: "fontawesome" },
];

function CircularProgress({ percent }: { percent: number }) {
  const size = 80;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percent);

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      {/* Background circle */}
      <View style={[
        {
          position: "absolute",
          width: size - strokeWidth * 2,
          height: size - strokeWidth * 2,
          borderRadius: (size - strokeWidth * 2) / 2,
          borderWidth: strokeWidth,
          borderColor: "#E5E7EB",
        }
      ]} />
      {/* Progress arc indicator (simplified for RN) */}
      <View style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: strokeWidth,
        borderColor: "#C5E84F",
        borderRightColor: "transparent",
        borderBottomColor: "transparent",
        transform: [{ rotate: "-45deg" }],
      }} />
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "700", color: "#1D3C34", fontFamily: "Inter_700Bold" }}>5/6</Text>
      </View>
    </View>
  );
}

function ShareIcon({ dest }: { dest: (typeof SHARE_DESTINATIONS)[0] }) {
  if (dest.iconType === "material")
    return <MaterialCommunityIcons name={dest.icon as any} size={22} color="#1A1A1A" />;
  if (dest.iconType === "fontawesome")
    return <FontAwesome5 name={dest.icon as any} size={18} color="#1A1A1A" />;
  return <Feather name={dest.icon as any} size={20} color="#1A1A1A" />;
}

function ShareBottomSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(SHEET_HEIGHT);
  const opacity = useSharedValue(0);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    if (visible) {
      setMounted(true);
      opacity.value = withTiming(1, { duration: 240 });
      translateY.value = withSpring(0, { damping: 22, stiffness: 200 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(SHEET_HEIGHT, { duration: 240 }, () => {
        runOnJS(setMounted)(false);
      });
    }
  }, [visible]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!mounted && !visible) return null;

  return (
    <Modal transparent animationType="none" visible={mounted} onRequestClose={onClose}>
      <View style={styles.sheetOverlayContainer}>
        <Animated.View style={[styles.sheetOverlay, overlayStyle]}>
          <Pressable style={{ flex: 1 }} onPress={onClose} />
        </Animated.View>
        <Animated.View style={[styles.sheetContainer, sheetStyle]}>
          {/* Handle */}
          <View style={styles.sheetHandle} />

          <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
            {/* Sheet header */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Share your Linktree</Text>
              <Pressable onPress={onClose} hitSlop={10}>
                <Feather name="x" size={20} color="#6B7280" />
              </Pressable>
            </View>

            {/* URL row */}
            <View style={styles.urlRow}>
              <View style={styles.urlPill}>
                <Text style={styles.urlAsterisk}>*</Text>
                <Text style={styles.urlText}>linktr.ee/novaonthemove</Text>
              </View>
              <Pressable style={styles.copyBtn}>
                <Feather name="copy" size={16} color="#7B3FE4" />
                <Text style={styles.copyText}>Copy</Text>
              </Pressable>
            </View>

            {/* Platform icons */}
            <View style={styles.platformIconRow}>
              <MaterialCommunityIcons name="instagram" size={26} color="#E1306C" />
              <MaterialCommunityIcons name="music-note" size={26} color="#000000" />
              <FontAwesome5 name="youtube" size={22} color="#FF0000" />
              <FontAwesome5 name="spotify" size={22} color="#1DB954" />
              <Feather name="globe" size={22} color="#7B3FE4" />
            </View>

            {/* Share destinations */}
            <Text style={styles.shareDestLabel}>Share to</Text>
            <View style={styles.shareDestGrid}>
              {SHARE_DESTINATIONS.map((dest) => (
                <Pressable
                  key={dest.id}
                  style={({ pressed }) => [styles.shareDestItem, pressed && { opacity: 0.7 }]}
                >
                  <View style={styles.shareDestIconBg}>
                    <ShareIcon dest={dest} />
                    {dest.isNew && (
                      <View style={styles.newBadge}>
                        <Text style={styles.newBadgeText}>NEW</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.shareDestLabel2}>{dest.label}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const { selectedTier, username } = useOnboarding();
  const [shareOpen, setShareOpen] = useState(false);
  const [linkToggles, setLinkToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(NOVA_LINKS.map((l) => [l.id, l.toggled]))
  );

  const colors = TIER_COLORS[selectedTier] || TIER_COLORS.free;
  const completedCount = CHECKLIST.filter((c) => c.done).length;
  const totalCount = CHECKLIST.length;

  const handleToggleLink = (id: string) => {
    setLinkToggles((prev) => ({ ...prev, [id]: !prev[id] }));
    Haptics.selectionAsync();
  };

  const handleShare = () => {
    setShareOpen(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Status bar area */}
      <View style={{ height: insets.top + (Platform.OS === "web" ? 67 : 0) }} />

      {/* Top nav */}
      <View style={styles.topNav}>
        <View style={styles.navLogoRow}>
          <Text style={styles.navAsterisk}>*</Text>
          <Text style={styles.navLogo}>linktree</Text>
        </View>
        <View style={styles.navRight}>
          <Pressable style={styles.navIconBtn} hitSlop={8}>
            <Feather name="bell" size={20} color="#1A1A1A" />
          </Pressable>
          <Pressable style={styles.navAvatarBtn}>
            <Image
              source={require("../assets/images/nova-avatar.png")}
              style={styles.navAvatar}
              contentFit="cover"
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile header */}
        <View style={styles.profileCard}>
          <Image
            source={require("../assets/images/nova-avatar.png")}
            style={styles.profileAvatar}
            contentFit="cover"
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>Nova Reyes</Text>
            <Text style={styles.profileHandle}>@{username || "novaonthemove"}</Text>
            <View style={styles.tierBadgeRow}>
              {selectedTier !== "free" && (
                <View style={[styles.tierBadge, { backgroundColor: colors.accent }]}>
                  <Text style={styles.tierBadgeText}>
                    {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)}
                  </Text>
                </View>
              )}
              <Pressable style={styles.viewLinkBtn} onPress={handleShare}>
                <Feather name="external-link" size={12} color="#7B3FE4" />
                <Text style={styles.viewLinkText}>View Linktree</Text>
              </Pressable>
            </View>
          </View>

          {/* Share button */}
          <Pressable
            style={({ pressed }) => [styles.shareBtn, pressed && { opacity: 0.85 }]}
            onPress={handleShare}
          >
            <Feather name="share-2" size={16} color="#FFFFFF" />
            <Text style={styles.shareBtnText}>Share</Text>
          </Pressable>
        </View>

        {/* Finish setup checklist */}
        <View style={[styles.setupCard, { backgroundColor: colors.card }]}>
          <View style={styles.setupCardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.setupTitle}>Finish your setup</Text>
              <Text style={styles.setupSub}>
                {completedCount}/{totalCount} steps completed
              </Text>
            </View>
            <CircularProgress percent={completedCount / totalCount} />
          </View>

          <View style={styles.checklistList}>
            {CHECKLIST.map((item) => (
              <View key={item.id} style={styles.checklistItem}>
                <View style={[styles.checkDot, item.done && styles.checkDotDone]}>
                  {item.done && <Feather name="check" size={11} color="#FFFFFF" />}
                </View>
                <Text style={[styles.checkLabel, item.done && styles.checkLabelDone]}>
                  {item.label}
                </Text>
                {!item.done && (
                  <Pressable
                    style={styles.doItBtn}
                    onPress={item.id === "share" ? handleShare : undefined}
                  >
                    <Text style={styles.doItText}>
                      {item.id === "share" ? "Share now →" : "Do it →"}
                    </Text>
                  </Pressable>
                )}
              </View>
            ))}
          </View>

          {/* Highlight: Share to finish */}
          <Pressable
            style={({ pressed }) => [styles.shareToFinish, { backgroundColor: colors.accent }, pressed && { opacity: 0.85 }]}
            onPress={handleShare}
          >
            <Feather name="share-2" size={16} color="#FFFFFF" />
            <Text style={styles.shareToFinishText}>Share to finish your Linktree</Text>
          </Pressable>
        </View>

        {/* Premium/Pro upsell if free */}
        {selectedTier === "free" && (
          <View style={styles.upsellCard}>
            <LinearGradient
              colors={["#7B3FE4", "#5B22C4"]}
              style={styles.upsellGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Feather name="zap" size={20} color="#C5E84F" />
              <Text style={styles.upsellTitle}>Upgrade to Pro</Text>
              <Text style={styles.upsellText}>
                Get your AI-personalized theme, full visual branding, and advanced analytics.
              </Text>
              <Pressable style={styles.upsellBtn} onPress={() => router.push("/monetization")}>
                <Text style={styles.upsellBtnText}>Try Pro free for 30 days</Text>
              </Pressable>
            </LinearGradient>
          </View>
        )}

        {/* Pro feature: TikTok featured if pro+ */}
        {(selectedTier === "pro" || selectedTier === "premium") && (
          <View style={[styles.featuredCard, { backgroundColor: colors.card }]}>
            <View style={styles.featuredHeader}>
              <MaterialCommunityIcons name="music-note" size={18} color="#000000" />
              <Text style={styles.featuredTitle}>TikTok — Featured</Text>
              <View style={styles.featuredAiBadge}>
                <Feather name="zap" size={10} color="#7B3FE4" />
                <Text style={styles.featuredAiText}>AI top pick</Text>
              </View>
            </View>
            <Text style={styles.featuredSub}>
              Your TikTok is pinned to the top of your Linktree based on your fastest-growing platform.
            </Text>
          </View>
        )}

        {/* Premium 0% fee callout */}
        {selectedTier === "premium" && (
          <View style={styles.premiumFeeCard}>
            <Feather name="dollar-sign" size={18} color="#B8860B" />
            <View style={{ flex: 1 }}>
              <Text style={styles.premiumFeeTitle}>0% transaction fees</Text>
              <Text style={styles.premiumFeeSub}>Keep 100% of your earnings</Text>
            </View>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeLabel}>PREMIUM</Text>
            </View>
          </View>
        )}

        {/* Stats row */}
        <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
          <Text style={styles.statsSectionTitle}>Last 7 days</Text>
          <View style={styles.statsRow}>
            {[
              { label: "Views", value: "2,841" },
              { label: "Clicks", value: "634" },
              { label: "CTR", value: "22.3%" },
            ].map((s) => (
              <View key={s.label} style={styles.statItem}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Links section */}
        <View style={[styles.linksCard, { backgroundColor: colors.card }]}>
          <View style={styles.linksHeader}>
            <Text style={styles.linksSectionTitle}>Your links</Text>
            <Pressable style={styles.addLinkBtn}>
              <Feather name="plus" size={16} color="#7B3FE4" />
              <Text style={styles.addLinkText}>Add link</Text>
            </Pressable>
          </View>
          {NOVA_LINKS.map((link) => (
            <View key={link.id} style={styles.linkItem}>
              <View style={[styles.linkIcon, { backgroundColor: link.color + "18" }]}>
                {(link as any).isMaterial
                  ? <MaterialCommunityIcons name={link.icon as any} size={17} color={link.color} />
                  : (link as any).isFontAwesome
                  ? <FontAwesome5 name={link.icon as any} size={15} color={link.color} />
                  : <Feather name={link.icon as any} size={15} color={link.color} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.linkTitle} numberOfLines={1}>{link.title}</Text>
                <Text style={styles.linkClicks}>{link.clicks.toLocaleString()} clicks</Text>
              </View>
              <Pressable
                style={[styles.toggleBtn, linkToggles[link.id] && styles.toggleBtnOn]}
                onPress={() => handleToggleLink(link.id)}
              >
                <View style={[styles.toggleThumb, linkToggles[link.id] && styles.toggleThumbOn]} />
              </Pressable>
            </View>
          ))}
        </View>

        <View style={{ height: insets.bottom + (Platform.OS === "web" ? 34 : 30) }} />
      </ScrollView>

      {/* Share bottom sheet */}
      <ShareBottomSheet visible={shareOpen} onClose={() => setShareOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  navLogoRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  navAsterisk: { fontSize: 20, fontWeight: "700", color: "#1D3C34", fontFamily: "Inter_700Bold" },
  navLogo: { fontSize: 16, fontWeight: "700", color: "#1D3C34", fontFamily: "Inter_700Bold" },
  navRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  navIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  navAvatarBtn: { width: 36, height: 36, borderRadius: 18, overflow: "hidden" },
  navAvatar: { width: 36, height: 36 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, gap: 12 },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  profileAvatar: { width: 52, height: 52, borderRadius: 26 },
  profileName: { fontSize: 16, fontWeight: "700", color: "#1A1A1A", fontFamily: "Inter_700Bold" },
  profileHandle: { fontSize: 13, color: "#9CA3AF", fontFamily: "Inter_400Regular", marginBottom: 4 },
  tierBadgeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tierBadgeText: { fontSize: 11, color: "#FFFFFF", fontFamily: "Inter_700Bold" },
  viewLinkBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewLinkText: { fontSize: 12, color: "#7B3FE4", fontFamily: "Inter_500Medium" },
  shareBtn: {
    backgroundColor: "#1D3C34",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  shareBtnText: { fontSize: 14, fontWeight: "700", color: "#FFFFFF", fontFamily: "Inter_700Bold" },
  setupCard: {
    borderRadius: 20,
    padding: 18,
    gap: 16,
  },
  setupCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  setupTitle: { fontSize: 17, fontWeight: "700", color: "#1A1A1A", fontFamily: "Inter_700Bold" },
  setupSub: { fontSize: 13, color: "#9CA3AF", fontFamily: "Inter_400Regular", marginTop: 2 },
  checklistList: { gap: 10 },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  checkDotDone: {
    backgroundColor: "#22C55E",
    borderColor: "#22C55E",
  },
  checkLabel: { flex: 1, fontSize: 14, color: "#374151", fontFamily: "Inter_400Regular" },
  checkLabelDone: { color: "#9CA3AF", textDecorationLine: "line-through" },
  doItBtn: {},
  doItText: { fontSize: 13, color: "#7B3FE4", fontFamily: "Inter_600SemiBold" },
  shareToFinish: {
    borderRadius: 14,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  shareToFinishText: { fontSize: 15, fontWeight: "700", color: "#FFFFFF", fontFamily: "Inter_700Bold" },
  upsellCard: { borderRadius: 20, overflow: "hidden" },
  upsellGradient: { padding: 20, gap: 8 },
  upsellTitle: { fontSize: 20, fontWeight: "700", color: "#FFFFFF", fontFamily: "Inter_700Bold" },
  upsellText: { fontSize: 13, color: "rgba(255,255,255,0.8)", fontFamily: "Inter_400Regular", lineHeight: 19 },
  upsellBtn: {
    backgroundColor: "#C5E84F",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
  },
  upsellBtnText: { fontSize: 15, fontWeight: "700", color: "#1D3C34", fontFamily: "Inter_700Bold" },
  featuredCard: { borderRadius: 20, padding: 16 },
  featuredHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  featuredTitle: { fontSize: 15, fontWeight: "700", color: "#1A1A1A", fontFamily: "Inter_700Bold", flex: 1 },
  featuredAiBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#F0E8FF",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  featuredAiText: { fontSize: 10, color: "#7B3FE4", fontFamily: "Inter_600SemiBold" },
  featuredSub: { fontSize: 12, color: "#6B7280", fontFamily: "Inter_400Regular", lineHeight: 17 },
  premiumFeeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFBEB",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  premiumFeeTitle: { fontSize: 15, fontWeight: "700", color: "#92400E", fontFamily: "Inter_700Bold" },
  premiumFeeSub: { fontSize: 12, color: "#92400E", fontFamily: "Inter_400Regular" },
  premiumBadge: {
    backgroundColor: "#D4A017",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  premiumBadgeLabel: { fontSize: 9, color: "#FFFFFF", fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  statsCard: { borderRadius: 20, padding: 18 },
  statsSectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Inter_700Bold",
    marginBottom: 14,
  },
  statsRow: { flexDirection: "row", justifyContent: "space-around" },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 22, fontWeight: "700", color: "#1A1A1A", fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 12, color: "#9CA3AF", fontFamily: "Inter_400Regular", marginTop: 2 },
  linksCard: { borderRadius: 20, padding: 18 },
  linksHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  linksSectionTitle: { fontSize: 15, fontWeight: "700", color: "#1A1A1A", fontFamily: "Inter_700Bold" },
  addLinkBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#F0E8FF",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  addLinkText: { fontSize: 13, color: "#7B3FE4", fontFamily: "Inter_600SemiBold" },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  linkIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  linkTitle: { fontSize: 14, fontWeight: "600", color: "#1A1A1A", fontFamily: "Inter_600SemiBold" },
  linkClicks: { fontSize: 12, color: "#9CA3AF", fontFamily: "Inter_400Regular" },
  toggleBtn: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  toggleBtnOn: { backgroundColor: "#C5E84F" },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbOn: { alignSelf: "flex-end" },
  // Share bottom sheet
  sheetOverlayContainer: { flex: 1 },
  sheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheetContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sheetTitle: { fontSize: 18, fontWeight: "700", color: "#1A1A1A", fontFamily: "Inter_700Bold" },
  urlRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  urlPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#F8F7F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  urlAsterisk: { fontSize: 16, fontWeight: "700", color: "#1D3C34", fontFamily: "Inter_700Bold" },
  urlText: { fontSize: 14, color: "#1A1A1A", fontFamily: "Inter_500Medium" },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#F0E8FF",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  copyText: { fontSize: 14, color: "#7B3FE4", fontFamily: "Inter_600SemiBold" },
  platformIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  shareDestLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9CA3AF",
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  shareDestGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 14,
  },
  shareDestItem: {
    width: "28%",
    alignItems: "center",
    gap: 7,
  },
  shareDestIconBg: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#F8F7F5",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  newBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#7B3FE4",
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  newBadgeText: { fontSize: 8, color: "#FFFFFF", fontFamily: "Inter_700Bold" },
  shareDestLabel2: { fontSize: 12, color: "#374151", fontFamily: "Inter_500Medium", textAlign: "center" },
});
