import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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

import { useOnboarding } from "@/context/OnboardingContext";

type BillingCycle = "monthly" | "annual";
type SectionConfig = { heading: string; items: string[] };

const TIER_DATA: Record<string, {
  name: string;
  monthlyPrice: string;
  annualMonthlyPrice: string;
  annualTotalPrice: string;
  annualSavePct: number;
  trialLabel: string | null;
  ctaText: string;
  gradient: [string, string];
  sections: SectionConfig[];
}> = {
  starter: {
    name: "Starter",
    monthlyPrice: "$8.00",
    annualMonthlyPrice: "$6.00",
    annualTotalPrice: "$72.00",
    annualSavePct: 25,
    trialLabel: null,
    ctaText: "Get started with Starter",
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
    monthlyPrice: "$15.00",
    annualMonthlyPrice: "$12.00",
    annualTotalPrice: "$144.00",
    annualSavePct: 20,
    trialLabel: "7-day free trial",
    ctaText: "Try Pro free for 7 days",
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
          "Highlight key links with spotlight",
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
          "Affiliate commissions for creators",
          "Priority 24/7 support",
        ],
      },
    ],
  },
  premium: {
    name: "Premium",
    monthlyPrice: "$35.00",
    annualMonthlyPrice: "$30.00",
    annualTotalPrice: "$360.00",
    annualSavePct: 14,
    trialLabel: null,
    ctaText: "Get started with Premium",
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
  const [billing, setBilling] = useState<BillingCycle>("annual");

  const isAnnual = billing === "annual";
  const displayPrice = isAnnual ? tier.annualMonthlyPrice : tier.monthlyPrice;
  const billingNote = isAnnual
    ? `Billed ${tier.annualTotalPrice}/year. Cancel anytime.`
    : tier.trialLabel
    ? `Free for 7 days. Then ${tier.monthlyPrice}/month. Cancel anytime.`
    : `Billed ${tier.monthlyPrice}/month. Cancel anytime.`;

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

      {/* Billing toggle */}
      <View style={styles.toggleWrap}>
        <View style={styles.togglePill}>
          <Pressable
            style={[styles.toggleOption, billing === "monthly" && styles.toggleOptionActive]}
            onPress={() => setBilling("monthly")}
          >
            <Text style={[styles.toggleText, billing === "monthly" && styles.toggleTextActive]}>
              Monthly
            </Text>
          </Pressable>
          <Pressable
            style={[styles.toggleOption, billing === "annual" && styles.toggleOptionActive]}
            onPress={() => setBilling("annual")}
          >
            <Text style={[styles.toggleText, billing === "annual" && styles.toggleTextActive]}>
              Annual
            </Text>
            <View style={styles.saveBadge}>
              <Text style={styles.saveBadgeText}>Save {tier.annualSavePct}%</Text>
            </View>
          </Pressable>
        </View>
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
              <Text style={styles.planCycleLabel}>{isAnnual ? "Billed annually" : "Billed monthly"}</Text>
            </View>
            <View style={styles.planPriceBlock}>
              <Text style={styles.planPrice}>{displayPrice}</Text>
              <Text style={styles.planBilling}>/month</Text>
              {isAnnual && (
                <View style={styles.annualSaveChip}>
                  <Text style={styles.annualSaveChipText}>Save {tier.annualSavePct}%</Text>
                </View>
              )}
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
          <Text style={styles.billingNoteText}>{billingNote}</Text>
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
        <Text style={styles.footerNote}>{billingNote}</Text>
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

  toggleWrap: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 2,
    alignItems: "center",
  },
  togglePill: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 50,
    padding: 4,
    gap: 2,
  },
  toggleOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 50,
  },
  toggleOptionActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontFamily: "Inter_500Medium",
  },
  toggleTextActive: {
    color: "#1A1A1A",
    fontFamily: "Inter_600SemiBold",
  },
  saveBadge: {
    backgroundColor: "#DCFCE7",
    borderRadius: 50,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  saveBadgeText: {
    fontSize: 11,
    color: "#16A34A",
    fontFamily: "Inter_600SemiBold",
  },

  scrollContent: { paddingHorizontal: 20, paddingTop: 16 },
  planCard: { borderRadius: 20, padding: 20, marginBottom: 14 },
  planCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  planLabel: { fontSize: 12, color: "rgba(255,255,255,0.65)", fontFamily: "Inter_500Medium" },
  planName: { fontSize: 22, fontWeight: "700", color: "#FFFFFF", fontFamily: "Inter_700Bold" },
  planCycleLabel: { fontSize: 12, color: "rgba(255,255,255,0.55)", fontFamily: "Inter_400Regular", marginTop: 2 },
  planPriceBlock: { alignItems: "flex-end", gap: 4 },
  planPrice: { fontSize: 30, fontWeight: "800", color: "#C5E84F", fontFamily: "Inter_700Bold" },
  planBilling: { fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: "Inter_400Regular" },
  annualSaveChip: {
    backgroundColor: "rgba(197,232,79,0.22)",
    borderRadius: 50,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "rgba(197,232,79,0.45)",
  },
  annualSaveChipText: {
    fontSize: 11,
    color: "#C5E84F",
    fontFamily: "Inter_600SemiBold",
  },
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
