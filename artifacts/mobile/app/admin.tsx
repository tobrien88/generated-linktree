import { Feather, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import Animated, {
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
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useOnboarding } from "@/context/OnboardingContext";
import { PlatformIcon } from "@/components/PlatformIcon";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.62;

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

type LinkItem = {
  id: string;
  title: string;
  clicks: number;
  toggled: boolean;
};

const NOVA_LINKS: LinkItem[] = [
  { id: "guide", title: "Free SE Asia Travel Guide", clicks: 324, toggled: true },
  { id: "tiktok", title: "Follow on TikTok", clicks: 892, toggled: true },
  { id: "presets", title: "Lightroom Preset Pack", clicks: 196, toggled: true },
  { id: "youtube", title: "Watch my vlogs", clicks: 441, toggled: true },
  { id: "website", title: "novaonthemove.com", clicks: 267, toggled: true },
];

const LINK_PLATFORM_IDS: Record<string, string> = {
  guide: "website",
  tiktok: "tiktok",
  presets: "website",
  youtube: "youtube",
  website: "website",
};

const LINK_COLORS: Record<string, string> = {
  guide: "#22C55E",
  tiktok: "#000000",
  presets: "#F59E0B",
  youtube: "#FF0000",
  website: "#7B3FE4",
};

const SHARE_DESTINATIONS = [
  { id: "linktree", label: "My Linktree" },
  { id: "qr", label: "QR Code" },
  { id: "digital-card", label: "Digital card", isNew: true },
  { id: "tiktok", label: "TikTok" },
  { id: "facebook", label: "Facebook" },
  { id: "x", label: "X" },
];

function ShareDestIcon({ destId }: { destId: string }) {
  switch (destId) {
    case "linktree":
      return <Feather name="external-link" size={20} color="#1A1A1A" />;
    case "qr":
      return <Feather name="maximize" size={20} color="#1A1A1A" />;
    case "digital-card":
      return <Feather name="credit-card" size={20} color="#1A1A1A" />;
    case "tiktok":
      return <MaterialCommunityIcons name="music-note" size={22} color="#1A1A1A" />;
    case "facebook":
      return <FontAwesome5 name="facebook" size={18} color="#1877F2" />;
    case "x":
      return <FontAwesome5 name="twitter" size={18} color="#1A1A1A" />;
    default:
      return <Feather name="share-2" size={20} color="#1A1A1A" />;
  }
}

function PlatformRow() {
  const platformIds = ["instagram", "tiktok", "youtube", "spotify", "website"];
  const platformColors: Record<string, string> = {
    instagram: "#E1306C",
    tiktok: "#000000",
    youtube: "#FF0000",
    spotify: "#1DB954",
    website: "#7B3FE4",
  };
  const platformLabels: Record<string, string> = {
    instagram: "Instagram",
    tiktok: "TikTok",
    youtube: "YouTube",
    spotify: "Spotify",
    website: "Website",
  };
  return (
    <View style={styles.platformRow}>
      {platformIds.map((id) => (
        <View key={id} style={styles.platformItem}>
          <View style={[styles.platformIconBg, { backgroundColor: platformColors[id] + "18" }]}>
            <PlatformIcon platformId={id} size={20} color={platformColors[id]} />
          </View>
          <Text style={styles.platformLabel}>{platformLabels[id]}</Text>
        </View>
      ))}
    </View>
  );
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
          <View style={styles.sheetHandle} />

          {/* Sheet header */}
          <View style={styles.sheetHeaderRow}>
            <Text style={styles.sheetTitle}>Share</Text>
            <View style={styles.sheetHeaderActions}>
              <Pressable style={styles.sheetGearBtn} hitSlop={10}>
                <Feather name="settings" size={18} color="#6B7280" />
              </Pressable>
              <Pressable style={styles.sheetCloseBtn} onPress={onClose} hitSlop={10}>
                <Feather name="x" size={18} color="#6B7280" />
              </Pressable>
            </View>
          </View>

          {/* URL row */}
          <View style={styles.urlRow}>
            <View style={styles.urlPill}>
              <Text style={styles.urlAsterisk}>*</Text>
              <Text style={styles.urlText}>linktr.ee/novaonthemove</Text>
            </View>
            <Pressable style={styles.copyBtn}>
              <Feather name="copy" size={15} color="#FFFFFF" />
              <Text style={styles.copyText}>Copy</Text>
            </Pressable>
          </View>

          {/* My platforms section */}
          <Text style={styles.myPlatformsLabel}>My platforms</Text>
          <PlatformRow />

          {/* Divider */}
          <View style={styles.sheetDivider} />

          {/* Share to — horizontal scroll */}
          <Text style={styles.shareToLabel}>Share to</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.shareDestRow}
          >
            {SHARE_DESTINATIONS.map((dest) => (
              <Pressable
                key={dest.id}
                style={({ pressed }) => [styles.shareDestItem, pressed && { opacity: 0.7 }]}
              >
                <View style={styles.shareDestIconBg}>
                  <ShareDestIcon destId={dest.id} />
                  {dest.isNew && (
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeText}>NEW</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.shareDestLabel2}>{dest.label}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={{ height: insets.bottom + 16 }} />
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

  const colors = TIER_COLORS[selectedTier] ?? TIER_COLORS.free;
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
      <View style={{ height: insets.top + (Platform.OS === "web" ? 67 : 0) }} />

      {/* Top nav */}
      <View style={styles.topNav}>
        <View style={styles.navLogoRow}>
          <Text style={styles.navAsterisk}>*</Text>
          <Text style={styles.navLogo}>linktree</Text>
        </View>
        <View style={styles.navRight}>
          <Pressable
            style={styles.navShareBtn}
            onPress={handleShare}
            hitSlop={8}
          >
            <Feather name="share-2" size={18} color="#1A1A1A" />
          </Pressable>
          <Pressable style={styles.navIconBtn} hitSlop={8}>
            <Feather name="bell" size={18} color="#1A1A1A" />
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
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
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
              <Text style={styles.setupSub}>{completedCount}/{totalCount} steps completed</Text>
            </View>

            {/* Circular progress indicator */}
            <Pressable style={styles.circleProgress} onPress={handleShare}>
              <View style={styles.circleOuter}>
                <View style={styles.circleInner}>
                  <Text style={styles.circleCount}>{completedCount}/{totalCount}</Text>
                </View>
              </View>
              <Text style={styles.shareToFinishHint}>Share{"\n"}to finish</Text>
            </Pressable>
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
                  <Pressable onPress={item.id === "share" ? handleShare : undefined}>
                    <Text style={styles.doItText}>
                      {item.id === "share" ? "Share now →" : "Do it →"}
                    </Text>
                  </Pressable>
                )}
              </View>
            ))}
          </View>

          {/* Share to finish CTA */}
          <Pressable
            style={({ pressed }) => [
              styles.shareToFinishBtn,
              { backgroundColor: colors.accent },
              pressed && { opacity: 0.85 },
            ]}
            onPress={handleShare}
          >
            <Feather name="share-2" size={16} color="#FFFFFF" />
            <Text style={styles.shareToFinishText}>Share to finish your Linktree</Text>
          </Pressable>
        </View>

        {/* Free upsell */}
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

        {/* Starter palette highlight */}
        {selectedTier === "starter" && (
          <View style={[styles.starterCard, { backgroundColor: colors.card }]}>
            <View style={styles.starterColorRow}>
              {["#C9614A", "#E8A87C", "#F5C89A", "#F0F0E8", "#1D3C34"].map((c) => (
                <View key={c} style={[styles.starterColorSwatch, { backgroundColor: c }]} />
              ))}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.starterCardTitle}>Custom palette active</Text>
              <Text style={styles.starterCardSub}>Nova Earth — warm terracotta tones</Text>
            </View>
            <Pressable>
              <Text style={styles.starterEditText}>Edit</Text>
            </Pressable>
          </View>
        )}

        {/* Pro: TikTok featured */}
        {(selectedTier === "pro" || selectedTier === "premium") && (
          <View style={[styles.featuredCard, { backgroundColor: colors.card }]}>
            <View style={styles.featuredHeader}>
              <MaterialCommunityIcons name="music-note" size={18} color="#000000" />
              <Text style={styles.featuredTitle}>TikTok — Featured link</Text>
              <View style={styles.featuredAiBadge}>
                <Feather name="zap" size={10} color="#7B3FE4" />
                <Text style={styles.featuredAiText}>AI top pick</Text>
              </View>
            </View>
            <Text style={styles.featuredSub}>
              Pinned to the top based on your fastest-growing platform — 284K followers, 38% engagement.
            </Text>
          </View>
        )}

        {/* Premium: 0% fees + concierge */}
        {selectedTier === "premium" && (
          <>
            <View style={styles.premiumFeeCard}>
              <View style={styles.premiumFeeBadge}>
                <Text style={styles.premiumFeeBadgeText}>0%</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.premiumFeeTitle}>Seller fees active</Text>
                <Text style={styles.premiumFeeSub}>Keep 100% of every sale you make</Text>
              </View>
            </View>
            <View style={[styles.conciergeCard, { backgroundColor: colors.card }]}>
              <Feather name="phone" size={18} color="#B8860B" />
              <View style={{ flex: 1 }}>
                <Text style={styles.conciergeTitle}>Concierge setup session</Text>
                <Text style={styles.conciergeSub}>Your dedicated expert is ready to help you launch.</Text>
              </View>
              <Pressable style={styles.conciergeBookBtn}>
                <Text style={styles.conciergeBookText}>Book</Text>
              </Pressable>
            </View>
          </>
        )}

        {/* Stats */}
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

        {/* Links */}
        <View style={[styles.linksCard, { backgroundColor: colors.card }]}>
          <View style={styles.linksHeader}>
            <Text style={styles.linksSectionTitle}>Your links</Text>
            <Pressable style={styles.addLinkBtn}>
              <Feather name="plus" size={16} color="#7B3FE4" />
              <Text style={styles.addLinkText}>Add link</Text>
            </Pressable>
          </View>
          {NOVA_LINKS.map((link) => {
            const isTikTok = link.id === "tiktok";
            const isProHighlighted = isTikTok && (selectedTier === "pro" || selectedTier === "premium");
            const starterAccent = selectedTier === "starter" ? "#C9614A" : LINK_COLORS[link.id];
            const iconBg = selectedTier === "starter"
              ? "#C9614A18"
              : LINK_COLORS[link.id] + "18";
            return (
              <View
                key={link.id}
                style={[
                  styles.linkItem,
                  isProHighlighted && styles.linkItemHighlighted,
                ]}
              >
                {isProHighlighted && (
                  <View style={styles.featuredLinkBadge}>
                    <Feather name="zap" size={9} color="#7B3FE4" />
                    <Text style={styles.featuredLinkBadgeText}>Featured</Text>
                  </View>
                )}
                <View style={[styles.linkIcon, { backgroundColor: iconBg }]}>
                  <PlatformIcon
                    platformId={LINK_PLATFORM_IDS[link.id]}
                    size={16}
                    color={selectedTier === "starter" ? starterAccent : LINK_COLORS[link.id]}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[styles.linkTitle, isProHighlighted && { color: "#7B3FE4" }]}
                    numberOfLines={1}
                  >
                    {link.title}
                  </Text>
                  <Text style={styles.linkClicks}>{link.clicks.toLocaleString()} clicks</Text>
                </View>
                <View style={styles.linkActions}>
                  <Pressable style={styles.linkActionBtn} hitSlop={6}>
                    <Feather name="edit-2" size={14} color="#9CA3AF" />
                  </Pressable>
                  <Pressable style={styles.linkActionBtn} hitSlop={6}>
                    <Feather name="share-2" size={14} color="#9CA3AF" />
                  </Pressable>
                  <Pressable
                    style={[styles.toggleBtn, !!linkToggles[link.id] && styles.toggleBtnOn]}
                    onPress={() => handleToggleLink(link.id)}
                  >
                    <View style={[styles.toggleThumb, !!linkToggles[link.id] && styles.toggleThumbOn]} />
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: insets.bottom + (Platform.OS === "web" ? 34 : 30) }} />
      </ScrollView>

      {/* Floating bottom-left circular progress */}
      <Pressable
        style={[styles.floatingCircle, { bottom: insets.bottom + (Platform.OS === "web" ? 50 : 36) }]}
        onPress={handleShare}
      >
        <View style={styles.floatingCircleOuter}>
          <View style={styles.floatingCircleInner}>
            <Text style={styles.floatingCircleCount}>{completedCount}/{totalCount}</Text>
            <Text style={styles.floatingCircleLabel}>Share{"\n"}to finish</Text>
          </View>
        </View>
      </Pressable>

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
    paddingVertical: 10,
  },
  navLogoRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  navAsterisk: { fontSize: 20, fontWeight: "700", color: "#1D3C34", fontFamily: "Inter_700Bold" },
  navLogo: { fontSize: 16, fontWeight: "700", color: "#1D3C34", fontFamily: "Inter_700Bold" },
  navRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  navShareBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
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
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  profileAvatar: { width: 52, height: 52, borderRadius: 26 },
  profileName: { fontSize: 16, fontWeight: "700", color: "#1A1A1A", fontFamily: "Inter_700Bold" },
  profileHandle: { fontSize: 13, color: "#9CA3AF", fontFamily: "Inter_400Regular", marginBottom: 4 },
  tierBadgeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  tierBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  tierBadgeText: { fontSize: 11, color: "#FFFFFF", fontFamily: "Inter_700Bold" },
  viewLinkBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
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
  setupCard: { borderRadius: 20, padding: 18, gap: 14 },
  setupCardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  setupTitle: { fontSize: 17, fontWeight: "700", color: "#1A1A1A", fontFamily: "Inter_700Bold" },
  setupSub: { fontSize: 13, color: "#9CA3AF", fontFamily: "Inter_400Regular", marginTop: 2 },
  circleProgress: { alignItems: "center", gap: 5 },
  circleOuter: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 5,
    borderColor: "#C5E84F",
    borderRightColor: "#E5E7EB",
    borderBottomColor: "#E5E7EB",
    transform: [{ rotate: "-45deg" }],
    alignItems: "center",
    justifyContent: "center",
  },
  circleInner: {
    transform: [{ rotate: "45deg" }],
    alignItems: "center",
  },
  circleCount: { fontSize: 15, fontWeight: "700", color: "#1D3C34", fontFamily: "Inter_700Bold" },
  shareToFinishHint: {
    fontSize: 10,
    color: "#9CA3AF",
    fontFamily: "Inter_500Medium",
    textAlign: "center",
    lineHeight: 13,
  },
  checklistList: { gap: 10 },
  checklistItem: { flexDirection: "row", alignItems: "center", gap: 10 },
  checkDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  checkDotDone: { backgroundColor: "#22C55E", borderColor: "#22C55E" },
  checkLabel: { flex: 1, fontSize: 14, color: "#374151", fontFamily: "Inter_400Regular" },
  checkLabelDone: { color: "#9CA3AF", textDecorationLine: "line-through" },
  doItText: { fontSize: 13, color: "#7B3FE4", fontFamily: "Inter_600SemiBold" },
  shareToFinishBtn: {
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
  starterCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 16,
    padding: 14,
  },
  starterColorRow: { flexDirection: "row", gap: 3 },
  starterColorSwatch: { width: 14, height: 14, borderRadius: 7 },
  starterCardTitle: { fontSize: 14, fontWeight: "600", color: "#1A1A1A", fontFamily: "Inter_600SemiBold" },
  starterCardSub: { fontSize: 12, color: "#9CA3AF", fontFamily: "Inter_400Regular" },
  starterEditText: { fontSize: 14, color: "#7B3FE4", fontFamily: "Inter_600SemiBold" },
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
  premiumFeeBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#B8860B",
    alignItems: "center",
    justifyContent: "center",
  },
  premiumFeeBadgeText: { fontSize: 13, fontWeight: "700", color: "#FFFFFF", fontFamily: "Inter_700Bold" },
  premiumFeeTitle: { fontSize: 15, fontWeight: "700", color: "#92400E", fontFamily: "Inter_700Bold" },
  premiumFeeSub: { fontSize: 12, color: "#92400E", fontFamily: "Inter_400Regular" },
  conciergeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    padding: 14,
  },
  conciergeTitle: { fontSize: 14, fontWeight: "600", color: "#1A1A1A", fontFamily: "Inter_600SemiBold" },
  conciergeSub: { fontSize: 12, color: "#9CA3AF", fontFamily: "Inter_400Regular" },
  conciergeBookBtn: {
    backgroundColor: "#B8860B",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  conciergeBookText: { fontSize: 13, fontWeight: "700", color: "#FFFFFF", fontFamily: "Inter_700Bold" },
  statsCard: { borderRadius: 20, padding: 18 },
  statsSectionTitle: { fontSize: 15, fontWeight: "700", color: "#1A1A1A", fontFamily: "Inter_700Bold", marginBottom: 14 },
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
    flexWrap: "wrap",
  },
  linkItemHighlighted: {
    backgroundColor: "#F8F6FF",
    borderRadius: 12,
    paddingHorizontal: 8,
    borderTopWidth: 0,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#E0D8FF",
  },
  featuredLinkBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#F0E8FF",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    width: "100%",
    marginBottom: 4,
  },
  featuredLinkBadgeText: {
    fontSize: 10,
    color: "#7B3FE4",
    fontFamily: "Inter_700Bold",
  },
  linkIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  linkTitle: { fontSize: 14, fontWeight: "600", color: "#1A1A1A", fontFamily: "Inter_600SemiBold" },
  linkClicks: { fontSize: 12, color: "#9CA3AF", fontFamily: "Inter_400Regular" },
  linkActions: { flexDirection: "row", alignItems: "center", gap: 6 },
  linkActionBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
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
  floatingCircle: {
    position: "absolute",
    left: 16,
    width: 68,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 8,
  },
  floatingCircleOuter: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 5,
    borderColor: "#C5E84F",
    borderRightColor: "#E5E7EB",
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    transform: [{ rotate: "-45deg" }],
    alignItems: "center",
    justifyContent: "center",
  },
  floatingCircleInner: {
    transform: [{ rotate: "45deg" }],
    alignItems: "center",
  },
  floatingCircleCount: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1D3C34",
    fontFamily: "Inter_700Bold",
  },
  floatingCircleLabel: {
    fontSize: 9,
    color: "#9CA3AF",
    fontFamily: "Inter_500Medium",
  },
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
    marginBottom: 12,
  },
  sheetHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sheetTitle: { fontSize: 20, fontWeight: "700", color: "#1A1A1A", fontFamily: "Inter_700Bold" },
  sheetHeaderActions: { flexDirection: "row", alignItems: "center", gap: 4 },
  sheetGearBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8F7F5",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8F7F5",
    alignItems: "center",
    justifyContent: "center",
  },
  urlRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 16,
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
    backgroundColor: "#000000",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  copyText: { fontSize: 14, color: "#FFFFFF", fontFamily: "Inter_600SemiBold" },
  platformRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  platformItem: { alignItems: "center", gap: 6 },
  platformIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  platformLabel: { fontSize: 10, color: "#6B7280", fontFamily: "Inter_500Medium" },
  sheetDivider: { height: 1, backgroundColor: "#F3F4F6", marginHorizontal: 20, marginBottom: 14 },
  myPlatformsLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  shareToLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  shareDestRow: { paddingHorizontal: 20, gap: 14 },
  shareDestItem: { alignItems: "center", gap: 7 },
  shareDestIconBg: {
    width: 58,
    height: 58,
    borderRadius: 18,
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
  shareDestLabel2: { fontSize: 11, color: "#374151", fontFamily: "Inter_500Medium", textAlign: "center" },
});
