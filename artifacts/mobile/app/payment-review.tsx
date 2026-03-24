import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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

import { useOnboarding } from "@/context/OnboardingContext";

type SectionConfig = { heading: string; items: string[] };

const TIER_DATA: Record<string, {
  name: string;
  price: string;
  trialLabel: string | null;
  ctaText: string;
  billingNote: string;
  gradient: [string, string];
  sections: SectionConfig[];
}> = {
  starter: {
    name: "Starter",
    price: "$6.00",
    trialLabel: null,
    ctaText: "Get started with Starter",
    billingNote: "Billed $6.00/month. Cancel anytime.",
    gradient: ["#F59E0B", "#D97706"],
    sections: [
      {
        heading: "Design & Branding",
        items: [
          "Custom color palettes",
          "Nova Earth terracotta palette — ready to activate",
          "Remove Linktree branding",
          "Social media icons & links",
          "Unique QR code with custom styling",
        ],
      },
      {
        heading: "Tools & Growth",
        items: [
          "Collect email & phone numbers — own your audience",
          "Highlight key links with spotlight",
          "Redirect links (leap links)",
          "Social link scheduling",
          "Reduced seller fees — 9% transaction fee",
          "Priority email support",
        ],
      },
    ],
  },
  pro: {
    name: "Pro",
    price: "$12.00",
    trialLabel: "7-day free trial",
    ctaText: "Try Pro free for 7 days",
    billingNote: "Free for 7 days, then $12.00/month. Cancel anytime.",
    gradient: ["#7B3FE4", "#5B22C4"],
    sections: [
      {
        heading: "AI-Personalization",
        items: [
          "Full AI-personalized Linktree",
          "AI bio generation from your social signals",
          "Personalized theme & color matching",
          "Smart link ordering by engagement",
          "Audience demographic insights",
        ],
      },
      {
        heading: "Branding & Commerce",
        items: [
          "Custom logo upload",
          "Full-screen video background",
          "Link thumbnails & spotlight links",
          "Advanced Linktree Shops",
          "Sell digital products & courses",
          "Reduced seller fees — 9% transaction fee",
        ],
      },
      {
        heading: "Growth & Integrations",
        items: [
          "Advanced analytics & UTM tracking",
          "Automated Instagram DM replies",
          "Link shortener",
          "Email marketing integrations",
          "Reduced seller fees — 9% transaction fee",
          "Affiliate commissions for creators",
          "Priority 24/7 support",
        ],
      },
    ],
  },
  premium: {
    name: "Premium",
    price: "$30.00",
    trialLabel: null,
    ctaText: "Get started with Premium",
    billingNote: "Billed $30.00/month. Cancel anytime.",
    gradient: ["#B8860B", "#8B6914"],
    sections: [
      {
        heading: "Creator Commerce",
        items: [
          "0% transaction fees — keep 100% of earnings",
          "Earn 100% commissions on affiliate products",
          "Unlimited Instagram replies with typo detection",
        ],
      },
      {
        heading: "Unlimited Creator Tools",
        items: [
          "Optional add-on team tools",
          "Dedicated concierge setup session",
          "Priority support queue",
          "Early access to new features",
        ],
      },
      {
        heading: "Team & Enterprise",
        items: [
          "Multiple team member seats",
          "Brand kit management",
          "API access & webhooks",
          "Bulk link management",
        ],
      },
    ],
  },
};

export default function PaymentReviewScreen() {
  const insets = useSafeAreaInsets();
  const { selectedTier } = useOnboarding();
  const tier = TIER_DATA[selectedTier] ?? TIER_DATA.pro;

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Feather name="chevron-left" size={22} color="#7B3FE4" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: "90%" }]} />
        </View>
        <Text style={styles.headerTitle}>Review your plan</Text>
        <Text style={styles.headerSub}>
          Here's everything included in Linktree {tier.name}.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Plan card */}
        <LinearGradient
          colors={tier.gradient}
          style={styles.planCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.planCardTop}>
            <View>
              <Text style={styles.planLabel}>Your plan</Text>
              <Text style={styles.planName}>Linktree {tier.name}</Text>
            </View>
            <View style={styles.planPriceBlock}>
              <Text style={styles.planPrice}>{tier.price}</Text>
              <Text style={styles.planBilling}>/month</Text>
            </View>
          </View>

          {tier.trialLabel && (
            <>
              <View style={styles.planDivider} />
              <View style={styles.trialRow}>
                <Feather name="gift" size={16} color="#C5E84F" />
                <Text style={styles.trialText}>{tier.trialLabel} — cancel anytime</Text>
              </View>
            </>
          )}
        </LinearGradient>

        {/* Trust badges */}
        <View style={styles.trustRow}>
          <View style={styles.trustItem}>
            <Feather name="shield" size={16} color="#22C55E" />
            <Text style={styles.trustText}>Secure & encrypted</Text>
          </View>
          <View style={styles.trustItem}>
            <Feather name="refresh-cw" size={16} color="#22C55E" />
            <Text style={styles.trustText}>Cancel anytime</Text>
          </View>
          {tier.trialLabel ? (
            <View style={styles.trustItem}>
              <Feather name="clock" size={16} color="#22C55E" />
              <Text style={styles.trustText}>{tier.trialLabel}</Text>
            </View>
          ) : (
            <View style={styles.trustItem}>
              <Feather name="zap" size={16} color="#22C55E" />
              <Text style={styles.trustText}>Instant access</Text>
            </View>
          )}
        </View>

        {/* What's included */}
        <Text style={styles.includedTitle}>What's included</Text>
        {tier.sections.map((section) => (
          <View key={section.heading} style={styles.featureSection}>
            <Text style={styles.sectionHeading}>{section.heading}</Text>
            <View style={styles.itemList}>
              {section.items.map((item) => (
                <View key={item} style={styles.itemRow}>
                  <View style={styles.checkCircle}>
                    <Feather name="check" size={12} color="#7B3FE4" />
                  </View>
                  <Text style={styles.itemText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Billing notice */}
        <View style={styles.billingNote}>
          <Feather name="info" size={14} color="#9CA3AF" />
          <Text style={styles.billingNoteText}>{tier.billingNote}</Text>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16) }]}>
        <Pressable
          style={({ pressed }) => [styles.startBtn, pressed && { opacity: 0.85 }]}
          onPress={() => router.push("/admin")}
        >
          <Feather name="zap" size={18} color="#1D3C34" />
          <Text style={styles.startBtnText}>{tier.ctaText}</Text>
        </Pressable>
        <Text style={styles.footerNote}>{tier.billingNote}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: { paddingHorizontal: 20, gap: 6, paddingBottom: 4 },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 2, alignSelf: "flex-start" },
  backText: { fontSize: 15, color: "#7B3FE4", fontFamily: "Inter_500Medium" },
  progressBar: { height: 4, backgroundColor: "#E5E7EB", borderRadius: 2, marginTop: 6 },
  progressFill: { height: 4, backgroundColor: "#7B3FE4", borderRadius: 2 },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#1A1A1A", fontFamily: "Inter_700Bold", marginTop: 8 },
  headerSub: { fontSize: 14, color: "#6B7280", fontFamily: "Inter_400Regular", lineHeight: 20 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16 },
  planCard: { borderRadius: 20, padding: 20, marginBottom: 14 },
  planCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  planLabel: { fontSize: 12, color: "rgba(255,255,255,0.65)", fontFamily: "Inter_500Medium" },
  planName: { fontSize: 22, fontWeight: "700", color: "#FFFFFF", fontFamily: "Inter_700Bold" },
  planPriceBlock: { alignItems: "flex-end" },
  planPrice: { fontSize: 30, fontWeight: "800", color: "#C5E84F", fontFamily: "Inter_700Bold" },
  planBilling: { fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: "Inter_400Regular" },
  planDivider: { height: 1, backgroundColor: "rgba(255,255,255,0.18)", marginVertical: 14 },
  trialRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  trialText: { fontSize: 14, color: "#C5E84F", fontFamily: "Inter_600SemiBold" },
  trustRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#F0FFF4",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  trustItem: { alignItems: "center", gap: 5 },
  trustText: { fontSize: 11, color: "#374151", fontFamily: "Inter_500Medium", textAlign: "center" },
  includedTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Inter_700Bold",
    marginBottom: 14,
  },
  featureSection: {
    marginBottom: 14,
    backgroundColor: "#F8F7FF",
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: "#7B3FE4",
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: "700",
    color: "#7B3FE4",
    fontFamily: "Inter_700Bold",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  itemList: { gap: 8 },
  itemRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#F0E8FF",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  itemText: { fontSize: 14, color: "#374151", fontFamily: "Inter_400Regular", flex: 1, lineHeight: 20 },
  billingNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
  },
  billingNoteText: {
    flex: 1,
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    gap: 10,
  },
  startBtn: {
    backgroundColor: "#C5E84F",
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  startBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1D3C34",
    fontFamily: "Inter_700Bold",
  },
  footerNote: {
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
