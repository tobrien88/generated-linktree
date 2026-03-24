import { Feather, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { ComponentProps, useState } from "react";
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

import { useOnboarding, Tier } from "@/context/OnboardingContext";

type FeatherIconName = ComponentProps<typeof Feather>["name"];
type Callout = { icon: FeatherIconName; label: string; desc: string };

type TierMeta = {
  id: Tier;
  name: string;
  price: string;
  billing: string;
  tagline: string;
  cta: string;
  trialNote: string | null;
  callouts: Callout[];
};

const TIER_META: TierMeta[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    billing: "forever",
    tagline: "Get your links live in minutes.",
    cta: "Continue with Free",
    trialNote: null,
    callouts: [
      { icon: "link", label: "Unlimited links", desc: "Add as many links as you need" },
      { icon: "bar-chart-2", label: "Basic analytics", desc: "Track clicks and view counts" },
      { icon: "globe", label: "linktr.ee subdomain", desc: "Your own linktr.ee/you URL" },
    ],
  },
  {
    id: "starter",
    name: "Starter",
    price: "$6",
    billing: "/mo",
    tagline: "Make it yours with your own style.",
    cta: "Get started with Starter",
    trialNote: "No free trial. Cancel anytime.",
    callouts: [
      { icon: "droplet", label: "Custom color palette", desc: "Match your brand — terracotta theme ready" },
      { icon: "eye-off", label: "Remove Linktree branding", desc: "Your page, your identity" },
      { icon: "mail", label: "Collect emails from fans", desc: "Own your audience directly" },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$12",
    billing: "/mo",
    tagline: "Advanced customization for serious creators.",
    cta: "Try Pro free for 7 days",
    trialNote: "Free for 7 days. Then $12/mo. Cancel anytime.",
    callouts: [
      { icon: "image", label: "Photo background & custom theme", desc: "Your SE Asia landscape, ready to go" },
      { icon: "award", label: "Custom logo upload", desc: "Brand every pixel of your page" },
      { icon: "star", label: "Spotlight & highlight key links", desc: "Feature your best content front and center" },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "$30",
    billing: "/mo",
    tagline: "For power creators scaling their brand.",
    cta: "Get started with Premium",
    trialNote: "No free trial. Cancel anytime.",
    callouts: [
      { icon: "percent", label: "0% transaction fees", desc: "Keep every dollar you earn" },
      { icon: "message-circle", label: "Unlimited Instagram DM replies", desc: "Auto-respond to fans 24/7" },
      { icon: "users", label: "Dedicated concierge setup", desc: "A human to set up your Linktree for you" },
    ],
  },
];

const PREVIEW_LINKS = ["Free SE Asia Travel Guide", "Follow me on TikTok", "My Lightroom Preset Pack"];

function ProfilePreview({ tierId }: { tierId: Tier }) {
  const socials = (color: string, opacity = 1) => (
    <View style={[styles.previewSocials, { opacity }]}>
      <MaterialCommunityIcons name="instagram" size={13} color={color} />
      <MaterialCommunityIcons name="music-note" size={13} color={color} />
      <FontAwesome5 name="youtube" size={12} color={color} />
    </View>
  );

  if (tierId === "pro" || tierId === "premium") {
    return (
      <View style={styles.previewCard}>
        <ImageBackground
          source={require("../assets/images/se-asia-bg.png")}
          style={styles.previewBg}
          imageStyle={styles.previewBgImage}
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.03)", "rgba(10,38,26,0.48)", "rgba(6,28,18,0.90)"]}
            style={styles.previewGradient}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          >
            {tierId === "pro" ? (
              <View style={styles.aiBadge}>
                <Feather name="zap" size={10} color="#C5E84F" />
                <Text style={styles.aiBadgeText}>AI PICK</Text>
              </View>
            ) : (
              <View style={styles.premiumBadge}>
                <Feather name="award" size={10} color="#B8860B" />
                <Text style={styles.premiumBadgeText}>PREMIUM</Text>
              </View>
            )}
            <View style={styles.previewAvatarRing}>
              <Image source={require("../assets/images/nova-avatar.png")} style={styles.previewAvatar} contentFit="cover" />
            </View>
            <Text style={styles.previewHandle}>@novaonthemove</Text>
            {socials("rgba(255,255,255,0.78)")}
            {PREVIEW_LINKS.map((title) => (
              <View key={title} style={styles.previewLinkDark}>
                <Text style={styles.previewLinkTextDark} numberOfLines={1}>{title}</Text>
              </View>
            ))}
          </LinearGradient>
        </ImageBackground>
      </View>
    );
  }

  if (tierId === "starter") {
    return (
      <View style={styles.previewCard}>
        <LinearGradient
          colors={["#C9614A", "#E8A87C"]}
          style={styles.previewGradientFull}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
        >
          <View style={[styles.previewAvatarRing, { borderColor: "rgba(255,255,255,0.7)" }]}>
            <Image source={require("../assets/images/nova-avatar.png")} style={styles.previewAvatar} contentFit="cover" />
          </View>
          <Text style={styles.previewHandleStandard}>@novaonthemove</Text>
          {socials("rgba(255,255,255,0.78)")}
          {PREVIEW_LINKS.map((title) => (
            <View key={title} style={styles.previewLinkRect}>
              <Text style={[styles.previewLinkTextRect, { color: "#FFFFFF" }]} numberOfLines={1}>{title}</Text>
            </View>
          ))}
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[styles.previewCard, styles.previewCardFree]}>
      <View style={styles.previewGradientFull}>
        <View style={[styles.previewAvatarRing, { borderColor: "#E5E7EB" }]}>
          <Image source={require("../assets/images/nova-avatar.png")} style={styles.previewAvatar} contentFit="cover" />
        </View>
        <Text style={[styles.previewHandleStandard, { color: "#1A1A1A" }]}>@novaonthemove</Text>
        {socials("#9CA3AF", 0.7)}
        {PREVIEW_LINKS.map((title) => (
          <View key={title} style={styles.previewLinkFree}>
            <Text style={styles.previewLinkTextFree} numberOfLines={1}>{title}</Text>
          </View>
        ))}
        <Text style={styles.freeBranding}>Powered by Linktree</Text>
      </View>
    </View>
  );
}

export default function MonetizationScreen() {
  const insets = useSafeAreaInsets();
  const { selectedTier, setSelectedTier } = useOnboarding();
  const [activeId, setActiveId] = useState<Tier>(selectedTier ?? "pro");

  function selectTier(id: Tier) {
    setActiveId(id);
    setSelectedTier(id);
    Haptics.selectionAsync();
  }

  const meta = TIER_META.find((t) => t.id === activeId) ?? TIER_META[2];

  const handleContinue = () => {
    if (activeId === "free") {
      router.push("/admin");
    } else {
      router.push("/payment-review");
    }
  };

  return (
    <View style={[styles.container, {
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0),
      ...(Platform.OS === "web" ? { height: "100vh" as unknown as number } : {}),
    }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Feather name="chevron-left" size={22} color="#7B3FE4" />
        </Pressable>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: "80%" }]} />
        </View>
        <View style={styles.sparkleRow}>
          <Feather name="zap" size={13} color="#7B3FE4" />
          <Text style={styles.sparkleLabel}>PERSONALIZED FOR YOU</Text>
        </View>
        <Text style={styles.title}>Choose your plan</Text>
        <Text style={styles.subtitle}>
          Based on your 284K audience, AI recommends{" "}
          <Text style={{ fontFamily: "Inter_700Bold", color: "#7B3FE4" }}>Pro</Text>.
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Tier toggle */}
        <View style={styles.tierToggle}>
          {TIER_META.map((t) => (
            <Pressable
              key={t.id}
              style={[styles.tierPill, activeId === t.id && styles.tierPillActive]}
              onPress={() => selectTier(t.id)}
            >
              <Text style={[styles.tierPillText, activeId === t.id && styles.tierPillTextActive]}>
                {t.name}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Live profile preview */}
        <ProfilePreview tierId={activeId} />

        {/* Price + tagline */}
        <View style={styles.pricingBlock}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.pricingName}>{meta.name}</Text>
            <Text style={styles.pricingTagline}>{meta.tagline}</Text>
          </View>
          <View style={styles.pricingRight}>
            <Text style={styles.pricingPrice}>{meta.price}</Text>
            {meta.billing !== "forever" && (
              <Text style={styles.pricingBilling}>{meta.billing}</Text>
            )}
          </View>
        </View>

        {/* Callouts */}
        <View style={styles.callouts}>
          {meta.callouts.map((c) => (
            <View key={c.label} style={styles.calloutRow}>
              <View style={[
                styles.calloutIcon,
                activeId === "pro" && { backgroundColor: "#EDE4FF" },
                activeId === "starter" && { backgroundColor: "#FFF3E8" },
                activeId === "premium" && { backgroundColor: "#FDF3DC" },
                activeId === "free" && { backgroundColor: "#F0F0F0" },
              ]}>
                <Feather
                  name={c.icon}
                  size={16}
                  color={
                    activeId === "pro" ? "#7B3FE4" :
                    activeId === "starter" ? "#C9614A" :
                    activeId === "premium" ? "#B8860B" :
                    "#6B7280"
                  }
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.calloutLabel}>{c.label}</Text>
                <Text style={styles.calloutDesc}>{c.desc}</Text>
              </View>
              <Feather name="check" size={16} color={
                activeId === "pro" ? "#7B3FE4" :
                activeId === "starter" ? "#C9614A" :
                activeId === "premium" ? "#B8860B" :
                "#9CA3AF"
              } />
            </View>
          ))}
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* Sticky footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16) }]}>
        <Pressable
          style={({ pressed }) => [
            styles.ctaBtn,
            activeId === "pro" && styles.ctaBtnPro,
            activeId === "premium" && styles.ctaBtnPremium,
            activeId === "starter" && styles.ctaBtnStarter,
            pressed && { opacity: 0.85 },
          ]}
          onPress={handleContinue}
        >
          <Text style={styles.ctaBtnText}>{meta.cta}</Text>
        </Pressable>
        <Text style={styles.trialNote}>
          {meta.trialNote ?? "You can upgrade anytime from your dashboard."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    paddingHorizontal: 20,
    paddingBottom: 0,
    gap: 4,
  },
  backBtn: { alignSelf: "flex-start", marginBottom: 6 },
  progressBar: { height: 4, backgroundColor: "#E5E7EB", borderRadius: 2, marginBottom: 10 },
  progressFill: { height: 4, backgroundColor: "#7B3FE4", borderRadius: 2 },
  sparkleRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  sparkleLabel: { fontSize: 11, color: "#7B3FE4", fontFamily: "Inter_700Bold", letterSpacing: 1 },
  title: { fontSize: 24, fontWeight: "700", color: "#1A1A1A", fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, color: "#6B7280", fontFamily: "Inter_400Regular", lineHeight: 19 },

  scrollContent: { paddingHorizontal: 20, paddingTop: 14 },

  tierToggle: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  tierPill: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: "center",
  },
  tierPillActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tierPillText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: "Inter_600SemiBold",
  },
  tierPillTextActive: {
    color: "#7B3FE4",
  },

  previewCard: {
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#0A2A1A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 8,
  },
  previewCardFree: {
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    shadowOpacity: 0.05,
    elevation: 1,
  },
  previewBg: { width: "100%" },
  previewBgImage: { borderRadius: 22 },
  previewGradient: {
    alignItems: "center",
    paddingTop: 44,
    paddingBottom: 22,
    paddingHorizontal: 20,
    gap: 6,
    position: "relative",
  },
  previewGradientFull: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
    gap: 6,
    backgroundColor: "#FFFFFF",
  },
  aiBadge: {
    position: "absolute",
    top: 12,
    left: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(197,232,79,0.18)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(197,232,79,0.3)",
  },
  aiBadgeText: { fontSize: 10, color: "#C5E84F", fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  premiumBadge: {
    position: "absolute",
    top: 12,
    left: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(184,134,11,0.18)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(184,134,11,0.3)",
  },
  premiumBadgeText: { fontSize: 10, color: "#B8860B", fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  previewAvatarRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
    overflow: "hidden",
    marginBottom: 2,
  },
  previewAvatar: { width: 56, height: 56 },
  previewHandle: {
    fontSize: 15,
    color: "#FFFFFF",
    fontFamily: "Quicksand_700Bold",
    letterSpacing: 0.3,
  },
  previewHandleStandard: {
    fontSize: 15,
    color: "#FFFFFF",
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0,
    marginBottom: 2,
  },
  previewSocials: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 2,
  },
  previewLinkDark: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 50,
    paddingVertical: 7,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  previewLinkTextDark: {
    fontSize: 11,
    color: "#1A1A1A",
    fontFamily: "Inter_600SemiBold",
  },
  previewLinkRect: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.28)",
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
  },
  previewLinkTextRect: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  previewLinkFree: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  previewLinkTextFree: {
    fontSize: 11,
    color: "#374151",
    fontFamily: "Inter_600SemiBold",
  },
  freeBranding: {
    fontSize: 10,
    color: "#9CA3AF",
    fontFamily: "Inter_400Regular",
    marginTop: 6,
  },

  pricingBlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  pricingName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Inter_700Bold",
  },
  pricingTagline: {
    fontSize: 13,
    color: "#6B7280",
    fontFamily: "Inter_400Regular",
    flexShrink: 1,
  },
  pricingRight: { alignItems: "flex-end", marginLeft: 12 },
  pricingPrice: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1A1A1A",
    fontFamily: "Inter_700Bold",
  },
  pricingBilling: {
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: "Inter_400Regular",
  },

  callouts: { gap: 8 },
  calloutRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F8F7FF",
    borderRadius: 14,
    padding: 14,
  },
  calloutIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EDE4FF",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  calloutLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Inter_600SemiBold",
    marginBottom: 1,
  },
  calloutDesc: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
  },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    gap: 8,
  },
  ctaBtn: {
    backgroundColor: "#1D3C34",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  ctaBtnPro: { backgroundColor: "#7B3FE4" },
  ctaBtnPremium: { backgroundColor: "#B8860B" },
  ctaBtnStarter: { backgroundColor: "#C9614A" },
  ctaBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
  },
  trialNote: {
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
