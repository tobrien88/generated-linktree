import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
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
const CARD_W = SCREEN_W - 48;
const CARD_GAP = 12;

type FeatureSection = { heading: string; items: string[] };

type TierConfig = {
  id: Tier;
  name: string;
  price: string;
  billing: string;
  tagline: string;
  personalizedCallout?: string;
  proTikTokCallout?: boolean;
  sections: FeatureSection[];
  cta: string;
  trialNote?: string;
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
        heading: "Core features",
        items: [
          "Unlimited links",
          "Basic click analytics",
          "Standard Linktree themes",
          "Linktree subdomain (linktr.ee/you)",
          "Social icons",
          "Videos & embeds",
          "QR code for your page",
          "SEO optimized landing page",
          "Linktree Shops (basic)",
          "Sponsored links",
          "Digital products & courses",
          "Mobile-optimized page",
        ],
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
    tagline: "Make it yours with a custom palette.",
    personalizedCallout: "Your Nova Earth terracotta palette is ready — just activate it",
    sections: [
      {
        heading: "Everything in Free, plus",
        items: [
          "Custom color palettes",
          "Remove Linktree branding",
          "Social media icons & links",
          "Collect email & phone numbers — own your audience",
          "Highlight key links with spotlight",
          "Redirect links (leap links)",
          "Social link scheduling",
          "Unique QR code with custom styling",
          "Reduced seller fees — 9% transaction fee",
          "Priority email support",
        ],
      },
    ],
    cta: "Get started with Starter",
    trialNote: "No free trial. Cancel anytime.",
    accentColor: "#F59E0B",
    headingColor: "#92400E",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$12",
    billing: "/mo",
    tagline: "Everything you need to grow.",
    personalizedCallout: "AI recommends Pro for @novaonthemove — your 284K TikTok audience converts 3x better with AI-personalized profiles",
    proTikTokCallout: true,
    sections: [
      {
        heading: "Everything in Starter, plus",
        items: [
          "Full AI-personalized Linktree",
          "AI bio generation from social signals",
          "Personalized theme & color matching",
          "Smart link ordering by engagement",
          "Custom logo upload",
          "Full-screen video background",
          "Advanced analytics & UTM tracking",
          "Automated Instagram DM replies",
          "Link shortener",
          "Email marketing integrations",
          "Reduced seller fees — 9% transaction fee",
          "Affiliate commissions for creators",
        ],
      },
      {
        heading: "Creator tools",
        items: [
          "Audience demographic insights",
          "Link thumbnails & spotlight links",
          "Advanced Linktree Shops",
          "Sell digital products & courses",
          "Priority 24/7 support",
        ],
      },
    ],
    cta: "Try Pro free for 7 days",
    trialNote: "Free for 7 days. Then $12/mo. Cancel anytime.",
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
    tagline: "For power creators scaling their brand.",
    personalizedCallout: "You earned $12K selling presets last month — 0% seller fees means Nova keeps every dollar",
    sections: [
      {
        heading: "Everything in Pro, plus",
        items: [
          "0% transaction fees — keep 100% of earnings",
          "Earn 100% commissions on affiliate products",
          "Unlimited Instagram replies with typo detection",
          "Dedicated concierge setup session",
          "Priority support queue",
          "Early access to new features",
        ],
      },
      {
        heading: "Team & enterprise",
        items: [
          "Optional add-on team tools",
          "Multiple team member seats",
          "Brand kit management",
          "API access & webhooks",
          "Bulk link management",
        ],
      },
    ],
    cta: "Get started with Premium",
    trialNote: "No free trial. Cancel anytime.",
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
    <ScrollView
      style={styles.cardInnerScroll}
      contentContainerStyle={styles.cardInner}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    >
      {tier.recommended && (
        <View style={styles.recommendedBadge}>
          <Feather name="zap" size={11} color="#C5E84F" />
          <Text style={[styles.recommendedText, { color: "#C5E84F" }]}>AI-RECOMMENDED</Text>
        </View>
      )}
      {tier.id === "premium" && (
        <View style={[styles.recommendedBadge, styles.premiumBadge]}>
          <Feather name="award" size={11} color="#B8860B" />
          <Text style={[styles.recommendedText, { color: "#B8860B" }]}>PREMIUM</Text>
        </View>
      )}

      {/* Price */}
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

      {/* Pro TikTok visual callout */}
      {tier.proTikTokCallout && (
        <View style={styles.tiktokCallout}>
          <View style={styles.tiktokCalloutLeft}>
            <View style={styles.tiktokIconBox}>
              <MaterialCommunityIcons name="music-note" size={20} color="#FFFFFF" />
            </View>
            <View style={{ gap: 2 }}>
              <Text style={styles.tiktokCalloutName}>TikTok · @novaonthemove</Text>
              <Text style={styles.tiktokCalloutStats}>284K followers · 38% engagement</Text>
            </View>
          </View>
          <View style={styles.tiktokCalloutBadge}>
            <Feather name="trending-up" size={11} color="#C5E84F" />
            <Text style={styles.tiktokCalloutBadgeText}>Top</Text>
          </View>
        </View>
      )}

      {/* Personalized callout */}
      {tier.personalizedCallout && !tier.proTikTokCallout && (
        <View style={[styles.calloutBox, isPro && styles.calloutBoxPro]}>
          <Feather name="zap" size={12} color={isPro ? "#C5E84F" : tier.accentColor} />
          <Text style={[styles.calloutText, isPro && styles.calloutTextPro]}>
            {tier.personalizedCallout}
          </Text>
        </View>
      )}
      {tier.proTikTokCallout && tier.personalizedCallout && (
        <View style={[styles.calloutBox, styles.calloutBoxPro]}>
          <Feather name="zap" size={12} color="#C5E84F" />
          <Text style={[styles.calloutText, styles.calloutTextPro]}>
            {tier.personalizedCallout}
          </Text>
        </View>
      )}

      {/* Feature sections */}
      {tier.sections.map((section) => (
        <View key={section.heading} style={styles.featureSection}>
          <Text style={[styles.sectionHeading, { color: isPro ? tier.headingColor : tier.accentColor }]}>
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
    </ScrollView>
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

  const initialIndex = TIERS.findIndex((t) => t.id === selectedTier);
  const [activeIndex, setActiveIndex] = useState(initialIndex >= 0 ? initialIndex : 2);

  const handleCarouselLayout = () => {
    const idx = initialIndex >= 0 ? initialIndex : 2;
    if (idx > 0) {
      scrollRef.current?.scrollTo({ x: idx * (CARD_W + CARD_GAP), animated: false });
    }
  };

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
            Based on your 284K audience and engagement rate, AI recommends{" "}
            <Text style={{ fontFamily: "Inter_700Bold", color: "#7B3FE4" }}>Pro</Text>.
          </Text>
        </View>
      </View>

      {/* Carousel */}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_W + CARD_GAP}
        decelerationRate="fast"
        contentContainerStyle={styles.carouselContent}
        onMomentumScrollEnd={handleScroll}
        onLayout={handleCarouselLayout}
        style={styles.carousel}
      >
        {TIERS.map((tier, idx) => (
          <View key={tier.id} style={{ width: CARD_W, height: 476, marginRight: idx < TIERS.length - 1 ? CARD_GAP : 0 }}>
            <TierCard
              tier={tier}
              isSelected={selectedTier === tier.id}
              onSelect={() => scrollToIndex(idx)}
            />
          </View>
        ))}
      </ScrollView>

      {/* Dots */}
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
          <Text style={styles.continueBtnText}>
            {selectedConfig?.cta ?? "Continue"}
          </Text>
        </Pressable>
        {selectedConfig?.trialNote ? (
          <Text style={styles.trialNote}>{selectedConfig.trialNote}</Text>
        ) : (
          <Text style={styles.trialNote}>You can upgrade anytime from your dashboard.</Text>
        )}
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
  carousel: { flexGrow: 0, height: 480 },
  carouselContent: { paddingHorizontal: 24 },
  card: {
    borderRadius: 22,
    overflow: "hidden",
    flex: 1,
    height: "100%",
  },
  cardDefault: {
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#FAFAFA",
  },
  cardSelected: { borderColor: "#7B3FE4" },
  cardSelectedPro: {
    shadowColor: "#7B3FE4",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  cardPremium: { borderColor: "#D4A017" },
  proGradient: { flex: 1 },
  cardInnerScroll: { flex: 1 },
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
  premiumBadge: {
    backgroundColor: "rgba(180,134,11,0.12)",
    borderColor: "#B8860B22",
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
  tierName: { fontSize: 24, fontWeight: "700", color: "#1A1A1A", fontFamily: "Inter_700Bold" },
  tierNameLight: { color: "#FFFFFF" },
  tierTagline: { fontSize: 13, color: "#6B7280", fontFamily: "Inter_400Regular", marginTop: 2 },
  tierTaglineLight: { color: "rgba(255,255,255,0.7)" },
  priceBlock: { alignItems: "flex-end" },
  price: { fontSize: 28, fontWeight: "800", color: "#1A1A1A", fontFamily: "Inter_700Bold" },
  priceBilling: { fontSize: 12, color: "#9CA3AF", fontFamily: "Inter_400Regular" },
  calloutBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
    backgroundColor: "#F0E8FF",
    borderRadius: 10,
    padding: 10,
  },
  calloutBoxPro: { backgroundColor: "rgba(255,255,255,0.12)" },
  calloutText: {
    flex: 1,
    fontSize: 12,
    color: "#7B3FE4",
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
  },
  calloutTextPro: { color: "rgba(255,255,255,0.9)" },
  tiktokCallout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 12,
    padding: 10,
    marginBottom: 2,
  },
  tiktokCalloutLeft: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  tiktokIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  tiktokCalloutName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "Inter_600SemiBold",
  },
  tiktokCalloutStats: { fontSize: 11, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular" },
  tiktokCalloutBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(197,232,79,0.18)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tiktokCalloutBadgeText: { fontSize: 11, color: "#C5E84F", fontFamily: "Inter_700Bold" },
  featureSection: { gap: 7 },
  sectionHeading: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
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
    marginTop: 10,
    marginBottom: 4,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#E5E7EB" },
  dotActive: { width: 18, backgroundColor: "#7B3FE4" },
  footer: { paddingHorizontal: 24, paddingTop: 8, gap: 8 },
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
  trialNote: {
    fontSize: 13,
    color: "#9CA3AF",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
