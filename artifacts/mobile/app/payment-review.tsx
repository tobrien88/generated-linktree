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
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useOnboarding } from "@/context/OnboardingContext";

const TIER_DETAILS = {
  free: { name: "Free", price: "$0", billing: "forever" },
  starter: { name: "Starter", price: "$6.00", billing: "/month" },
  pro: { name: "Pro", price: "$12.00", billing: "/month" },
  premium: { name: "Premium", price: "$30.00", billing: "/month" },
};

export default function PaymentReviewScreen() {
  const insets = useSafeAreaInsets();
  const { selectedTier } = useOnboarding();
  const tierInfo = TIER_DETAILS[selectedTier];

  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");
  const [cardName, setCardName] = useState("Nova Reyes");
  const [expiry, setExpiry] = useState("08/27");
  const [cvv, setCvv] = useState("•••");

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const handleSubmit = () => {
    router.push("/admin");
  };

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
        <Text style={styles.headerTitle}>Payment details</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Order summary */}
        <View style={styles.summaryCard}>
          <LinearGradient
            colors={["#7B3FE4", "#5B22C4"]}
            style={styles.summaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.summaryRow}>
              <View>
                <Text style={styles.summaryLabel}>Your plan</Text>
                <Text style={styles.summaryPlan}>Linktree {tierInfo.name}</Text>
              </View>
              <View style={styles.summaryPriceBlock}>
                <Text style={styles.summaryPrice}>{tierInfo.price}</Text>
                <Text style={styles.summaryBilling}>{tierInfo.billing}</Text>
              </View>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.trialRow}>
              <Feather name="gift" size={14} color="#C5E84F" />
              <Text style={styles.trialText}>30-day free trial included</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Trust badges */}
        <View style={styles.trustRow}>
          {[
            { icon: "lock" as const, label: "Secure payment" },
            { icon: "refresh-cw" as const, label: "Cancel anytime" },
            { icon: "shield" as const, label: "Encrypted" },
          ].map((b) => (
            <View key={b.label} style={styles.trustBadge}>
              <Feather name={b.icon} size={14} color="#22C55E" />
              <Text style={styles.trustText}>{b.label}</Text>
            </View>
          ))}
        </View>

        {/* Card form */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>Card information</Text>

          {/* Virtual card preview */}
          <LinearGradient
            colors={["#1A1A2E", "#16213E"]}
            style={styles.cardPreview}
          >
            <View style={styles.cardLogoRow}>
              <Text style={styles.cardLogoText}>VISA</Text>
              <View style={styles.chipIcon}>
                <View style={styles.chipInner} />
              </View>
            </View>
            <Text style={styles.cardNumberDisplay}>{cardNumber}</Text>
            <View style={styles.cardBottomRow}>
              <View>
                <Text style={styles.cardFieldLabel}>CARD HOLDER</Text>
                <Text style={styles.cardFieldValue}>{cardName}</Text>
              </View>
              <View>
                <Text style={styles.cardFieldLabel}>EXPIRES</Text>
                <Text style={styles.cardFieldValue}>{expiry}</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Card number input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Card number</Text>
            <TextInput
              style={styles.input}
              value={cardNumber}
              onChangeText={(v) => setCardNumber(formatCardNumber(v))}
              keyboardType="numeric"
              placeholder="1234 5678 9012 3456"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name on card</Text>
            <TextInput
              style={styles.input}
              value={cardName}
              onChangeText={setCardName}
              placeholder="Your full name"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Expiry</Text>
              <TextInput
                style={styles.input}
                value={expiry}
                onChangeText={setExpiry}
                placeholder="MM/YY"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>CVV</Text>
              <TextInput
                style={styles.input}
                value={cvv}
                onChangeText={setCvv}
                placeholder="•••"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
            </View>
          </View>
        </View>

        {/* Or */}
        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>OR PAY WITH</Text>
          <View style={styles.orLine} />
        </View>

        {/* Apple/Google Pay buttons */}
        <View style={styles.altPayRow}>
          <Pressable style={[styles.altPayBtn, { backgroundColor: "#000000" }]}>
            <Feather name="smartphone" size={18} color="#FFFFFF" />
            <Text style={[styles.altPayText, { color: "#FFFFFF" }]}>Apple Pay</Text>
          </Pressable>
          <Pressable style={styles.altPayBtn}>
            <View style={[styles.gPayG, { backgroundColor: "#4285F4" }]}>
              <Text style={styles.gPayGText}>G</Text>
            </View>
            <Text style={styles.altPayText}>Google Pay</Text>
          </Pressable>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16) }]}>
        <Pressable
          style={({ pressed }) => [styles.payBtn, pressed && { opacity: 0.85 }]}
          onPress={handleSubmit}
        >
          <Feather name="lock" size={16} color="#1D3C34" />
          <Text style={styles.payBtnText}>
            Start free trial — pay {tierInfo.price} after 30 days
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: { paddingHorizontal: 20, gap: 12, paddingBottom: 4 },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 2, alignSelf: "flex-start" },
  backText: { fontSize: 15, color: "#7B3FE4", fontFamily: "Inter_500Medium" },
  progressBar: { height: 4, backgroundColor: "#E5E7EB", borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: "#7B3FE4", borderRadius: 2 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#1A1A1A", fontFamily: "Inter_700Bold" },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16 },
  summaryCard: { borderRadius: 20, overflow: "hidden", marginBottom: 16 },
  summaryGradient: { padding: 20 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  summaryLabel: { fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: "Inter_400Regular" },
  summaryPlan: { fontSize: 22, fontWeight: "700", color: "#FFFFFF", fontFamily: "Inter_700Bold" },
  summaryPriceBlock: { alignItems: "flex-end" },
  summaryPrice: { fontSize: 28, fontWeight: "800", color: "#C5E84F", fontFamily: "Inter_700Bold" },
  summaryBilling: { fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: "Inter_400Regular" },
  summaryDivider: { height: 1, backgroundColor: "rgba(255,255,255,0.15)", marginVertical: 14 },
  trialRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  trialText: { fontSize: 14, color: "#C5E84F", fontFamily: "Inter_600SemiBold" },
  trustRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    backgroundColor: "#F0FFF4",
    borderRadius: 12,
    padding: 12,
  },
  trustBadge: { alignItems: "center", gap: 4 },
  trustText: { fontSize: 11, color: "#374151", fontFamily: "Inter_500Medium" },
  cardSection: { gap: 12, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#1A1A1A", fontFamily: "Inter_700Bold" },
  cardPreview: {
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  cardLogoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardLogoText: { fontSize: 18, fontWeight: "700", color: "#FFFFFF", fontFamily: "Inter_700Bold", letterSpacing: 2 },
  chipIcon: {
    width: 32,
    height: 24,
    borderRadius: 4,
    backgroundColor: "#D4A017",
    alignItems: "center",
    justifyContent: "center",
  },
  chipInner: {
    width: 20,
    height: 14,
    borderRadius: 3,
    backgroundColor: "#FFD700",
    opacity: 0.6,
  },
  cardNumberDisplay: {
    fontSize: 20,
    color: "#FFFFFF",
    fontFamily: "Inter_500Medium",
    letterSpacing: 3,
  },
  cardBottomRow: { flexDirection: "row", justifyContent: "space-between" },
  cardFieldLabel: { fontSize: 9, color: "rgba(255,255,255,0.5)", fontFamily: "Inter_700Bold", letterSpacing: 1, marginBottom: 2 },
  cardFieldValue: { fontSize: 13, color: "#FFFFFF", fontFamily: "Inter_600SemiBold" },
  inputGroup: { gap: 6 },
  inputLabel: { fontSize: 12, color: "#6B7280", fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.4 },
  input: {
    backgroundColor: "#F8F7F5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1A1A1A",
    fontFamily: "Inter_500Medium",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  inputRow: { flexDirection: "row", gap: 12 },
  orRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  orLine: { flex: 1, height: 1, backgroundColor: "#E5E7EB" },
  orText: { fontSize: 11, color: "#9CA3AF", fontFamily: "Inter_600SemiBold", letterSpacing: 1 },
  altPayRow: { flexDirection: "row", gap: 10 },
  altPayBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  altPayText: { fontSize: 15, fontWeight: "600", color: "#1A1A1A", fontFamily: "Inter_600SemiBold" },
  gPayG: { width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  gPayGText: { fontSize: 13, fontWeight: "700", color: "#FFFFFF", fontFamily: "Inter_700Bold" },
  footer: { paddingHorizontal: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#F3F4F6" },
  payBtn: {
    backgroundColor: "#C5E84F",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  payBtnText: { fontSize: 15, fontWeight: "700", color: "#1D3C34", fontFamily: "Inter_700Bold", textAlign: "center" },
});
