import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useOnboarding, Tier } from "@/context/OnboardingContext";

const SCREEN_W = Dimensions.get("window").width;
const CARD_W = SCREEN_W - 48; // 24px side padding each
const CARD_GAP = 12;

type FeatureSection = { heading: string; items: string[] };

type TierConfig = {
  id: Tier;
  name: string;
  price: string;
  billing: string;
  tagline: string;
  aiCallout?: string;
  sections: FeatureSection[];
  cta: string;
  recommended?: boolean;
  gradient?: [string, string];
  accentColor: string;
  headingColor: string;
};

const TIERS: TierConfig[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    billing: "forever",
    tagline: "The basics to get your links live.",
    sections: [
      {
        heading: "Core Features",
        items: ["Unlimited links", "Basic click analytics", "Standard themes", "Linktree branding"],
      },
    ],
    cta: "Continue with Free",
    accentColor: "#6B7280",
    headingColor: "#374151",
  },
  {
    id: "starter",
    name: "Starter",
    price: "$6",
    billing: "/mo",
    tagline: "Customize your look and feel.",
    sections: [
      {
        heading: "Everything in Free, plus",
        items: [
          "Custom color palettes",
          "Remove Linktree branding",
          "Priority email support",
          "Scheduling (2 links)",
        ],
      },
    ],
    cta: "Start Starter",
    accentColor: "#F59E0B",
    headingColor: "#92400E",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$12",
    billing: "/mo",
    tagline: "Everything you need to grow.",
    aiCallout: "AI recommends this for @novaonthemove based on your 284K TikTok audience",
    sections: [
      {
        heading: "Everything in Starter, plus",
        items: [
          "Full AI-personalized Linktree",
          "Custom logo upload",
          "Full-screen video background",
          "Advanced analytics dashboard",
          "Social media scheduling",
          "Sell products & collect payments",
        ],
      },
      {
        heading: "AI Features",
        items: [
          "Auto bio generation from social signals",
          "Personalized theme matching",
          "Smart link ordering",
          "Audience insights",
        ],
      },
    ],
    cta: "Start Pro free for 30 days",
    recommended: true,
    gradient: ["#7B3FE4", "#5B22C4"],
    accentColor: "#7B3FE4",
    headingColor: "#C5E84F",
  },
  {
    id: "premium",
    name: "Premium",
    price: "$30",
    billing: "/mo",
    tagline: "For power creators and brands.",
    sections: [
      {
        heading: "Everything in Pro, plus",
        items: [
          "0% transaction fees on sales",
          "White-label experience",
          "Custom domain support",
          "Dedicated concierge setup",
          "Priority queue support",
          "Early access to new features",
        ],
      },
      {
        heading: "Enterprise Features",
        items: [
          "Team member seats",
          "Brand kit management",
          "API access",
        ],
      },
    ],
    cta: "Start Premium",
    accentColor: "#B8860B",
    headingColor: "#92400E",
  },
];

function TierCard({ tier, isSelected, onSelect }: {
  tier: TierConfig;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const isPro = tier.id === "pro";

  const content = (
    <View style={styles.cardInner}>
      {/* Top badge area */}
      {tier.recommended && (
        <View style={styles.recommendedBadge}>
          <Feather name="zap" size={11} color="#C5E84F" />
          <Text style={[styles.recommendedText, { color: "#C5E84F" }]}>AI-RECOMMENDED</Text>
        </View>
      )}
      {tier.id === "premium" && (
        <View style={[styles.recommendedBadge, { backgroundColor: "rgba(180,134,11,0.15)", borderColor: "#B8860B22" }]}>
          <Feather name="award" size={11} color="#B8860B" />
          <Text style={[styles.recommendedText, { color: "#B8860B" }]}>PREMIUM</Text>
        </View>
      )}

      {/* Price row */}
      <View style={styles.priceRow}>
        <View>
          <Text style={[styles.tierName, isPro && styles.tierNameLight]}>{tier.name}</Text>
          <Text style={[styles.tierTagline, isPro && styles.tierTaglineLight]}>{tier.tagline}</Text>
        </View>
        <View style={styles.priceBlock}>
          <Text style={[styles.price, isPro && { color: "#C5E84F" }]}>{tier.price}</Text>
          <Text style={[styles.priceBilling, isPro && styles.tierTaglineLight]}>{tier.billing}</Text>
        </View>
      </View>

      {/* AI callout */}
      {tier.aiCallout && (
        <View style={styles.aiCalloutBox}>
          <Feather name="zap" size={12} color="#C5E84F" />
          <Text style={styles.aiCalloutText}>{tier.aiCallout}</Text>
        </View>
      )}

      {/* Feature sections */}
      {tier.sections.map((section) => (
        <View key={section.heading} style={styles.featureSection}>
          <Text style={[styles.sectionHeading, { color: isPro ? tier.headingColor : tier.headingColor }]}>
            {section.heading}
          </Text>
          {section.items.map((item) => (
            <View key={item} style={styles.featureRow}>
              <Feather
                name="check"
                size={14}
                color={isPro ? "#C5E84F" : tier.accentColor}
              />
              <Text style={[styles.featureText, isPro && styles.featureTextLight]}>{item}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );

  if (isPro) {
    return (
      <Pressable onPress={onSelect} style={[styles.card, isSelected && styles.cardSelectedPro]}>
        <LinearGradient
          colors={tier.gradient!}
          style={styles.proGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onSelect}
      style={[
        styles.card,
        styles.cardDefault,
        isSelected && styles.cardSelected,
        tier.id === "premium" && styles.cardPremium,
      ]}
    >
      {content}
    </Pressable>
  );
}

export default function MonetizationScreen() {
  const insets = useSafeAreaInsets();
  const { selectedTier, setSelectedTier } = useOnboarding();
  const scrollRef = useRef<ScrollView>(null);

  // Find initial tier index
  const initialIndex = TIERS.findIndex((t) => t.id === selectedTier);
  const [activeIndex, setActiveIndex] = useState(initialIndex >= 0 ? initialIndex : 2);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / (CARD_W + CARD_GAP));
    if (idx >= 0 && idx < TIERS.length) {
      const newTier = TIERS[idx];
      if (newTier.id !== selectedTier) {
        setSelectedTier(newTier.id);
        setActiveIndex(idx);
        Haptics.selectionAsync();
      }
    }
  };

  const scrollToIndex = (idx: number) => {
    scrollRef.current?.scrollTo({ x: idx * (CARD_W + CARD_GAP), animated: true });
    setSelectedTier(TIERS[idx].id);
    setActiveIndex(idx);
    Haptics.selectionAsync();
  };

  const selectedConfig = TIERS[activeIndex];

  const handleContinue = () => {
    if (selectedTier === "free") {
      router.push("/admin");
    } else {
      router.push("/payment-review");
    }
  };

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
        <View style={styles.headerTextRow}>
          <View style={styles.sparkleRow}>
            <Feather name="zap" size={14} color="#7B3FE4" />
            <Text style={styles.sparkleLabel}>PERSONALIZED FOR YOU</Text>
          </View>
          <Text style={styles.title}>Choose your plan</Text>
          <Text style={styles.subtitle}>
            Based on your audience size and goals, we recommend{" "}
            <Text style={{ fontFamily: "Inter_700Bold", color: "#7B3FE4" }}>Pro</Text>.
          </Text>
        </View>
      </View>

      {/* Carousel */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_W + CARD_GAP}
        decelerationRate="fast"
        contentContainerStyle={styles.carouselContent}
        onMomentumScrollEnd={handleScroll}
        contentOffset={{ x: activeIndex * (CARD_W + CARD_GAP), y: 0 }}
        style={styles.carousel}
      >
        {TIERS.map((tier, idx) => (
          <View key={tier.id} style={{ width: CARD_W, marginRight: idx < TIERS.length - 1 ? CARD_GAP : 0 }}>
            <TierCard
              tier={tier}
              isSelected={selectedTier === tier.id}
              onSelect={() => scrollToIndex(idx)}
            />
          </View>
        ))}
      </ScrollView>

      {/* Dot indicators */}
      <View style={styles.dots}>
        {TIERS.map((tier, idx) => (
          <Pressable
            key={tier.id}
            onPress={() => scrollToIndex(idx)}
            style={[styles.dot, activeIndex === idx && styles.dotActive]}
          />
        ))}
      </View>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16) }]}>
        <Pressable
          style={({ pressed }) => [
            styles.continueBtn,
            selectedConfig?.id === "pro" && styles.continueBtnPro,
            pressed && { opacity: 0.85 },
          ]}
          onPress={handleContinue}
        >
          <Text style={[styles.continueBtnText, selectedConfig?.id === "pro" && styles.continueBtnTextPro]}>
            {selectedConfig?.cta ?? "Continue"}
          </Text>
        </Pressable>
        <Text style={styles.trialNote}>
          {selectedTier !== "free" ? "Try free for 30 days. Cancel anytime." : "You can upgrade anytime from your dashboard."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: { paddingHorizontal: 24, gap: 10, paddingBottom: 8 },
  backBtn: { alignSelf: "flex-start" },
  progressBar: { height: 4, backgroundColor: "#E5E7EB", borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: "#7B3FE4", borderRadius: 2 },
  headerTextRow: { gap: 4 },
  sparkleRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  sparkleLabel: { fontSize: 11, color: "#7B3FE4", fontFamily: "Inter_700Bold", letterSpacing: 1 },
  title: { fontSize: 26, fontWeight: "700", color: "#1A1A1A", fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 14, color: "#6B7280", fontFamily: "Inter_400Regular", lineHeight: 20 },
  carousel: { flexGrow: 0 },
  carouselContent: { paddingHorizontal: 24 },
  card: {
    borderRadius: 22,
    overflow: "hidden",
    flex: 1,
  },
  cardDefault: {
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#FAFAFA",
  },
  cardSelected: {
    borderColor: "#7B3FE4",
  },
  cardSelectedPro: {
    shadowColor: "#7B3FE4",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  cardPremium: {
    borderColor: "#D4A017",
  },
  proGradient: { flex: 1 },
  cardInner: { padding: 22, gap: 14 },
  recommendedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(197,232,79,0.15)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(197,232,79,0.25)",
  },
  recommendedText: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.8,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  tierName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Inter_700Bold",
  },
  tierNameLight: { color: "#FFFFFF" },
  tierTagline: { fontSize: 13, color: "#6B7280", fontFamily: "Inter_400Regular", marginTop: 2 },
  tierTaglineLight: { color: "rgba(255,255,255,0.7)" },
  priceBlock: { alignItems: "flex-end" },
  price: { fontSize: 28, fontWeight: "800", color: "#1A1A1A", fontFamily: "Inter_700Bold" },
  priceBilling: { fontSize: 12, color: "#9CA3AF", fontFamily: "Inter_400Regular" },
  aiCalloutBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 10,
    padding: 10,
  },
  aiCalloutText: {
    flex: 1,
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
  },
  featureSection: { gap: 7 },
  sectionHeading: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  featureRow: { flexDirection: "row", alignItems: "flex-start", gap: 9 },
  featureText: {
    fontSize: 14,
    color: "#374151",
    fontFamily: "Inter_400Regular",
    flex: 1,
    lineHeight: 20,
  },
  featureTextLight: { color: "rgba(255,255,255,0.9)" },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 12,
    marginBottom: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E5E7EB",
  },
  dotActive: {
    width: 18,
    backgroundColor: "#7B3FE4",
  },
  footer: { paddingHorizontal: 24, paddingTop: 8, gap: 10 },
  continueBtn: {
    backgroundColor: "#1D3C34",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  continueBtnPro: { backgroundColor: "#7B3FE4" },
  continueBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
  },
  continueBtnTextPro: { color: "#FFFFFF" },
  trialNote: {
    fontSize: 13,
    color: "#9CA3AF",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
