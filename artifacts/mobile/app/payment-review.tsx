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
  billing: string;
  sections: SectionConfig[];
  gradient: [string, string];
}> = {
  starter: {
    name: "Starter",
    price: "$6.00",
    billing: "per month after trial",
    gradient: ["#F59E0B", "#D97706"],
    sections: [
      {
        heading: "Design & Branding",
        items: ["Custom color palettes", "Remove Linktree branding"],
      },
      {
        heading: "Support",
        items: ["Priority email support", "Scheduling (2 links)"],
      },
    ],
  },
  pro: {
    name: "Pro",
    price: "$12.00",
    billing: "per month after trial",
    gradient: ["#7B3FE4", "#5B22C4"],
    sections: [
      {
        heading: "AI-Personalization",
        items: [
          "Full AI-personalized Linktree",
          "AI bio generation from your social signals",
          "Smart link ordering by engagement",
          "Personalized theme matching",
        ],
      },
      {
        heading: "Branding & Visuals",
        items: [
          "Custom logo upload",
          "Full-screen video background",
          "Unlimited themes",
        ],
      },
      {
        heading: "Growth & Analytics",
        items: [
          "Advanced analytics dashboard",
          "Audience demographic insights",
          "Social scheduling — unlimited links",
          "Sell products & collect payments",
        ],
      },
    ],
  },
  premium: {
    name: "Premium",
    price: "$30.00",
    billing: "per month after trial",
    gradient: ["#B8860B", "#8B6914"],
    sections: [
      {
        heading: "Creator Commerce",
        items: [
          "0% transaction fees on all sales",
          "White-label experience",
          "Custom domain support",
        ],
      },
      {
        heading: "Concierge & Support",
        items: [
          "Dedicated concierge setup session",
          "Priority queue support",
          "Early access to new features",
        ],
      },
      {
        heading: "Enterprise",
        items: ["Team member seats", "Brand kit management", "API access"],
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
          Here's everything included in your Linktree {tier.name} plan.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Plan summary card */}
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
              <Text style={styles.planBilling}>{tier.billing}</Text>
            </View>
          </View>
          <View style={styles.planDivider} />
          <View style={styles.trialRow}>
            <Feather name="gift" size={16} color="#C5E84F" />
            <Text style={styles.trialText}>30-day free trial — cancel anytime</Text>
          </View>
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
          <View style={styles.trustItem}>
            <Feather name="clock" size={16} color="#22C55E" />
            <Text style={styles.trustText}>Free for 30 days</Text>
          </View>
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
          <Text style={styles.billingNoteText}>
            Your card won't be charged until your 30-day free trial ends on{" "}
            <Text style={styles.billingNoteBold}>April 23, 2026</Text>. You can cancel before then at no charge.
          </Text>
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
          <Text style={styles.startBtnText}>Start my free trial</Text>
        </Pressable>
        <Text style={styles.footerNote}>
          Billed {tier.price} monthly after trial. Cancel anytime.
        </Text>
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
    marginBottom: 16,
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
  billingNoteBold: { fontFamily: "Inter_700Bold", color: "#6B7280" },
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
