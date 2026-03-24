import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useOnboarding, Tier } from "@/context/OnboardingContext";

type TierConfig = {
  id: Tier;
  name: string;
  price: string;
  billing: string;
  description: string;
  features: string[];
  cta: string;
  recommended?: boolean;
  badgeColor?: string;
  gradient?: [string, string];
};

const TIERS: TierConfig[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    billing: "forever",
    description: "The basics to get your links live.",
    features: [
      "Unlimited links",
      "Basic analytics",
      "Standard themes",
      "Linktree branding",
    ],
    cta: "Continue free",
  },
  {
    id: "starter",
    name: "Starter",
    price: "$6",
    billing: "/mo",
    description: "Customize your look.",
    features: [
      "Everything in Free",
      "Custom color palettes",
      "Remove Linktree branding",
      "Priority support",
    ],
    cta: "Start Starter",
    badgeColor: "#F59E0B",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$12",
    billing: "/mo",
    description: "Everything you need to grow.",
    features: [
      "Everything in Starter",
      "Full AI-personalized Linktree",
      "Custom logo upload",
      "Full-screen video background",
      "Analytics dashboard",
      "Social media scheduling",
    ],
    cta: "Start Pro",
    recommended: true,
    badgeColor: "#7B3FE4",
    gradient: ["#7B3FE4", "#5B22C4"],
  },
  {
    id: "premium",
    name: "Premium",
    price: "$30",
    billing: "/mo",
    description: "For power creators and brands.",
    features: [
      "Everything in Pro",
      "0% transaction fees",
      "White-label experience",
      "Dedicated concierge setup",
      "Priority queue support",
    ],
    cta: "Start Premium",
    badgeColor: "#B8860B",
    gradient: ["#B8860B", "#8B6914"],
  },
];

function TierCard({
  tier,
  isSelected,
  onSelect,
}: {
  tier: TierConfig;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const isPro = tier.id === "pro";
  const isPremium = tier.id === "premium";
  const isPaid = tier.id !== "free";

  if (isPro) {
    return (
      <Pressable onPress={onSelect}>
        <LinearGradient
          colors={tier.gradient!}
          style={[styles.tierCard, styles.proCard, isSelected && styles.tierCardSelected]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.tierCardHeader}>
            <View>
              <View style={styles.proRecommendedRow}>
                <Feather name="zap" size={12} color="#C5E84F" />
                <Text style={styles.recommendedLabel}>AI-RECOMMENDED</Text>
              </View>
              <Text style={[styles.tierName, { color: "#FFFFFF" }]}>{tier.name}</Text>
            </View>
            <View style={styles.priceBlock}>
              <Text style={[styles.tierPrice, { color: "#C5E84F" }]}>{tier.price}</Text>
              <Text style={[styles.tierBilling, { color: "rgba(255,255,255,0.7)" }]}>{tier.billing}</Text>
            </View>
          </View>

          <Text style={[styles.tierDescription, { color: "rgba(255,255,255,0.8)" }]}>
            {tier.description}
          </Text>

          <View style={styles.featureList}>
            {tier.features.map((f) => (
              <View key={f} style={styles.featureRow}>
                <Feather name="check" size={14} color="#C5E84F" />
                <Text style={[styles.featureText, { color: "rgba(255,255,255,0.9)" }]}>{f}</Text>
              </View>
            ))}
          </View>

          {isSelected && (
            <View style={styles.proSelectedBadge}>
              <Feather name="check-circle" size={16} color="#C5E84F" />
              <Text style={styles.proSelectedText}>Selected</Text>
            </View>
          )}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={[
        styles.tierCard,
        isSelected && styles.tierCardSelected,
        isPremium && styles.premiumCard,
      ]}
      onPress={onSelect}
    >
      {tier.recommended && (
        <View style={[styles.recommendedBadge, { backgroundColor: tier.badgeColor }]}>
          <Text style={styles.recommendedBadgeText}>RECOMMENDED</Text>
        </View>
      )}

      {isPremium && (
        <View style={[styles.premiumBadge]}>
          <Feather name="award" size={10} color="#B8860B" />
          <Text style={styles.premiumBadgeText}>PREMIUM</Text>
        </View>
      )}

      <View style={styles.tierCardHeader}>
        <View>
          <Text style={styles.tierName}>{tier.name}</Text>
        </View>
        <View style={styles.priceBlock}>
          <Text style={[styles.tierPrice, isPremium && { color: "#B8860B" }]}>{tier.price}</Text>
          <Text style={styles.tierBilling}>{tier.billing}</Text>
        </View>
      </View>

      <Text style={styles.tierDescription}>{tier.description}</Text>

      <View style={styles.featureList}>
        {tier.features.slice(0, 4).map((f) => (
          <View key={f} style={styles.featureRow}>
            <Feather name="check" size={14} color={isPaid ? (tier.badgeColor || "#22C55E") : "#6B7280"} />
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}
        {tier.features.length > 4 && (
          <Text style={styles.moreFeatures}>+{tier.features.length - 4} more features</Text>
        )}
      </View>

      {isSelected && (
        <View style={styles.selectedIndicator}>
          <Feather name="check-circle" size={14} color={tier.badgeColor || "#22C55E"} />
        </View>
      )}
    </Pressable>
  );
}

export default function MonetizationScreen() {
  const insets = useSafeAreaInsets();
  const { selectedTier, setSelectedTier } = useOnboarding();

  const handleSelect = (tier: Tier) => {
    setSelectedTier(tier);
    Haptics.selectionAsync();
  };

  const handleContinue = () => {
    if (selectedTier === "free") {
      router.push("/admin");
    } else {
      router.push("/payment-review");
    }
  };

  const selectedConfig = TIERS.find((t) => t.id === selectedTier)!;

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Feather name="chevron-left" size={22} color="#7B3FE4" />
        </Pressable>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: "80%" }]} />
        </View>
      </View>

      <View style={styles.headerText}>
        <View style={styles.sparkleRow}>
          <Feather name="zap" size={14} color="#7B3FE4" />
          <Text style={styles.sparkleLabel}>PERSONALIZED FOR YOU</Text>
        </View>
        <Text style={styles.title}>Choose your plan</Text>
        <Text style={styles.subtitle}>
          Based on your audience size and goals, we recommend <Text style={{ fontFamily: "Inter_700Bold", color: "#7B3FE4" }}>Pro</Text>.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {TIERS.map((tier) => (
          <TierCard
            key={tier.id}
            tier={tier}
            isSelected={selectedTier === tier.id}
            onSelect={() => handleSelect(tier.id)}
          />
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16) }]}>
        <Pressable
          style={({ pressed }) => [styles.continueBtn, pressed && { opacity: 0.85 }]}
          onPress={handleContinue}
        >
          <Text style={styles.continueBtnText}>{selectedConfig.cta}</Text>
        </Pressable>
        <Text style={styles.trialNote}>
          {selectedTier !== "free" ? "Try free for 30 days. Cancel anytime." : "You can upgrade anytime."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: { paddingHorizontal: 20, gap: 12, paddingBottom: 0 },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 2, alignSelf: "flex-start" },
  progressBar: { height: 4, backgroundColor: "#E5E7EB", borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: "#7B3FE4", borderRadius: 2 },
  headerText: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 8 },
  sparkleRow: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 4 },
  sparkleLabel: { fontSize: 11, color: "#7B3FE4", fontFamily: "Inter_700Bold", letterSpacing: 1 },
  title: { fontSize: 26, fontWeight: "700", color: "#1A1A1A", fontFamily: "Inter_700Bold", marginBottom: 6 },
  subtitle: { fontSize: 14, color: "#6B7280", fontFamily: "Inter_400Regular", lineHeight: 20 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 12, gap: 12 },
  tierCard: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#FAFAFA",
    position: "relative",
    overflow: "hidden",
  },
  tierCardSelected: {
    borderColor: "#7B3FE4",
    backgroundColor: "#F8F7FF",
  },
  proCard: {
    borderColor: "transparent",
    borderWidth: 0,
  },
  premiumCard: {
    borderColor: "#D4A017",
  },
  recommendedBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 16,
  },
  recommendedBadgeText: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#D4A017",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  premiumBadgeText: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    color: "#B8860B",
    letterSpacing: 0.5,
  },
  proRecommendedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  recommendedLabel: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    color: "#C5E84F",
    letterSpacing: 1,
  },
  tierCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  tierName: { fontSize: 20, fontWeight: "700", color: "#1A1A1A", fontFamily: "Inter_700Bold" },
  priceBlock: { alignItems: "flex-end" },
  tierPrice: { fontSize: 22, fontWeight: "700", color: "#1A1A1A", fontFamily: "Inter_700Bold" },
  tierBilling: { fontSize: 12, color: "#9CA3AF", fontFamily: "Inter_400Regular" },
  tierDescription: { fontSize: 13, color: "#6B7280", fontFamily: "Inter_400Regular", marginBottom: 12 },
  featureList: { gap: 6 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  featureText: { fontSize: 13, color: "#374151", fontFamily: "Inter_400Regular", flex: 1 },
  moreFeatures: { fontSize: 12, color: "#9CA3AF", fontFamily: "Inter_400Regular", paddingLeft: 22 },
  selectedIndicator: { position: "absolute", top: 14, right: 14 },
  proSelectedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 12,
    backgroundColor: "rgba(197,232,79,0.15)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: "flex-start",
  },
  proSelectedText: { fontSize: 13, color: "#C5E84F", fontFamily: "Inter_600SemiBold" },
  footer: { paddingHorizontal: 20, paddingTop: 12, gap: 10 },
  continueBtn: {
    backgroundColor: "#7B3FE4",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  continueBtnText: { fontSize: 16, fontWeight: "700", color: "#FFFFFF", fontFamily: "Inter_700Bold" },
  trialNote: { fontSize: 13, color: "#9CA3AF", fontFamily: "Inter_400Regular", textAlign: "center" },
});
