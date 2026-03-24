import { Feather, FontAwesome5 } from "@expo/vector-icons";
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

type PaymentMethod = "card" | "googlepay" | "paypal";

const TIER_PRICES: Record<string, { monthly: number; annual: number; name: string; hasTrial: boolean; ctaLabel: string }> = {
  starter: { monthly: 8, annual: 6 * 12, name: "Starter", hasTrial: false, ctaLabel: "Confirm purchase" },
  pro:     { monthly: 15, annual: 12 * 12, name: "Pro",     hasTrial: true,  ctaLabel: "Start your free trial" },
  premium: { monthly: 35, annual: 30 * 12, name: "Premium", hasTrial: true,  ctaLabel: "Try free for 7 days" },
};

function Radio({ selected }: { selected: boolean }) {
  return (
    <View style={styles.radio}>
      {selected && <View style={styles.radioInner} />}
    </View>
  );
}

export default function PaymentScreen() {
  const insets = useSafeAreaInsets();
  const { selectedTier } = useOnboarding();
  const tierInfo = TIER_PRICES[selectedTier] ?? TIER_PRICES.pro;

  const [method, setMethod] = useState<PaymentMethod>("card");

  const [cardNumber, setCardNumber] = useState("4111 1111 1111 1111");
  const [expiry, setExpiry] = useState("10/27");
  const [cvv, setCvv] = useState("1234");
  const [zip, setZip] = useState("10001");

  const annualTotal = tierInfo.annual;
  const tax = 9;
  const dueToday = tierInfo.hasTrial ? 0 : annualTotal;

  const trialEndDate = "Mar 31st, 2026";

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Logo */}
        <View style={styles.logoRow}>
          <Text style={styles.logoText}>Linktree</Text>
          <Text style={styles.logoStar}>✳</Text>
        </View>

        {/* Back */}
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="chevron-left" size={16} color="#7B3FE4" />
          <Text style={styles.backText}>Back to plans</Text>
        </Pressable>

        {/* Title */}
        <Text style={styles.title}>
          {tierInfo.hasTrial ? "Start your free trial" : `Get ${tierInfo.name}`}
        </Text>

        {/* Benefits */}
        {tierInfo.hasTrial ? (
          <View style={styles.benefitsList}>
            {[
              "Free 7 day trial, cancel any time",
              "We'll email you 2 days before trial ends",
              "After the trial ends, you'll be charged",
            ].map((b) => (
              <View key={b} style={styles.benefitRow}>
                <Feather name="check" size={14} color="#22C55E" />
                <Text style={styles.benefitText}>{b}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* ─── Payment ───────────────────────────────────── */}
        <Text style={styles.sectionHeading}>Payment</Text>

        {/* Payment method group */}
        <View style={styles.paymentGroup}>
          {/* Card */}
          <Pressable style={styles.payGroupRow} onPress={() => setMethod("card")}>
            <Radio selected={method === "card"} />
            <Feather name="credit-card" size={18} color="#1A1A1A" style={{ marginLeft: 8 }} />
            <Text style={styles.payOptionLabel}>Card</Text>
          </Pressable>

          {method === "card" && (
            <View style={styles.cardForm}>
              <View style={styles.fieldRow}>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="Card number"
                  placeholderTextColor="#9CA3AF"
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  keyboardType="number-pad"
                  maxLength={19}
                />
                <View style={styles.cardBrands}>
                  <FontAwesome5 name="cc-visa" size={14} color="#1A1AFF" />
                  <FontAwesome5 name="cc-mastercard" size={14} color="#EB001B" />
                  <FontAwesome5 name="cc-amex" size={14} color="#2E77BC" />
                </View>
              </View>
              <View style={styles.twoCol}>
                <TextInput
                  style={[styles.input, styles.inputHalf]}
                  placeholder="Expiration date"
                  placeholderTextColor="#9CA3AF"
                  value={expiry}
                  onChangeText={setExpiry}
                  keyboardType="number-pad"
                  maxLength={5}
                />
                <View style={[styles.input, styles.inputHalf, styles.cvvWrap]}>
                  <TextInput
                    style={styles.cvvInput}
                    placeholder="Security code"
                    placeholderTextColor="#9CA3AF"
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="number-pad"
                    maxLength={4}
                    secureTextEntry
                  />
                  <Feather name="credit-card" size={16} color="#9CA3AF" />
                </View>
              </View>
              <View style={[styles.input, styles.countryRow]}>
                <View>
                  <Text style={styles.countryLabel}>Country</Text>
                  <Text style={styles.countryValue}>United States</Text>
                </View>
                <Feather name="chevron-down" size={18} color="#6B7280" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="ZIP code"
                placeholderTextColor="#9CA3AF"
                value={zip}
                onChangeText={setZip}
                keyboardType="number-pad"
                maxLength={10}
              />
            </View>
          )}

          <View style={styles.payGroupDivider} />

          {/* Google Pay */}
          <Pressable style={styles.payGroupRow} onPress={() => setMethod("googlepay")}>
            <Radio selected={method === "googlepay"} />
            <FontAwesome5 name="google" size={16} color="#4285F4" style={{ marginLeft: 10 }} />
            <Text style={styles.payOptionLabel}>Google Pay</Text>
          </Pressable>

          <View style={styles.payGroupDivider} />

          {/* PayPal */}
          <Pressable style={styles.payGroupRow} onPress={() => setMethod("paypal")}>
            <Radio selected={method === "paypal"} />
            <FontAwesome5 name="paypal" size={20} color="#003087" style={{ marginLeft: 10 }} />
            <Text style={[styles.payOptionLabel, { color: "#003087", fontFamily: "Inter_700Bold" }]}>PayPal</Text>
            <View style={styles.paypalHelpBtn}>
              <Feather name="help-circle" size={18} color="#FFFFFF" />
            </View>
          </Pressable>
        </View>

        <Text style={styles.cookiePref}>Cookie Preferences</Text>

        {/* ─── Your trial plan ──────────────────────────── */}
        <Text style={styles.sectionHeading}>Your trial plan</Text>
        {/* Pricing summary */}
        <View style={styles.pricingRow}>
          <Text style={styles.pricingName}>Linktree {tierInfo.name}</Text>
          <View style={styles.pricingRight}>
            {tierInfo.hasTrial && (
              <Text style={styles.pricingStrike}>${annualTotal}.00</Text>
            )}
            {tierInfo.hasTrial ? (
              <Text style={styles.pricingFree}>Free for 7 days!</Text>
            ) : (
              <Text style={styles.pricingAmount}>${annualTotal}.00</Text>
            )}
          </View>
        </View>

        <Pressable>
          <Text style={styles.couponLink}>Add coupon code</Text>
        </Pressable>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Due on {trialEndDate}</Text>
          <Text style={styles.summaryValue}>${annualTotal}/year</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>+ Tax</Text>
          <Text style={styles.summaryValue}>${tax}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.dueTodayRow}>
          <Text style={styles.dueTodayLabel}>Due today</Text>
          <Text style={styles.dueTodayAmount}>${dueToday} USD</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer CTA */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === "web" ? 24 : 12) }]}>
        <Pressable
          style={({ pressed }) => [styles.ctaBtn, pressed && { opacity: 0.9 }]}
          onPress={() => router.push("/admin")}
        >
          <Feather name="zap" size={18} color="#FFFFFF" />
          <Text style={styles.ctaBtnText}>{tierInfo.ctaLabel}</Text>
        </Pressable>
        {tierInfo.hasTrial && (
          <Text style={styles.footerNote}>
            Your plan will start on {trialEndDate}, unless you cancel.
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scroll: { paddingHorizontal: 20 },

  logoRow: { flexDirection: "row", alignItems: "center", gap: 4, paddingTop: 12, marginBottom: 8 },
  logoText: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#1A1A1A" },
  logoStar: { fontSize: 16, color: "#22C55E" },

  backBtn: { flexDirection: "row", alignItems: "center", gap: 2, marginBottom: 16 },
  backText: { fontSize: 14, color: "#7B3FE4", fontFamily: "Inter_500Medium" },

  title: { fontSize: 28, fontFamily: "Inter_700Bold", color: "#1A1A1A", marginBottom: 16, lineHeight: 34 },

  benefitsList: { gap: 10, marginBottom: 24 },
  benefitRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  benefitText: { fontSize: 14, color: "#374151", fontFamily: "Inter_400Regular", flex: 1, lineHeight: 20 },

  sectionHeading: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#1A1A1A", marginBottom: 12, marginTop: 4 },

  paymentGroup: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 6,
  },
  payGroupRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  payGroupDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 14,
  },
  payOptionLabel: { fontSize: 15, fontFamily: "Inter_500Medium", color: "#1A1A1A", marginLeft: 8 },

  cardForm: { paddingHorizontal: 14, paddingBottom: 14, gap: 10 },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#1A1A1A",
    flex: 1,
  },
  fieldInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#1A1A1A",
  },
  cardBrands: { flexDirection: "row", gap: 6, alignItems: "center", marginLeft: 8 },
  twoCol: { flexDirection: "row", gap: 8 },
  inputHalf: { flex: 1 },
  cvvWrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 0,
  },
  cvvInput: { flex: 1, paddingVertical: 12, fontSize: 14, fontFamily: "Inter_400Regular", color: "#1A1A1A" },
  countryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    flex: undefined,
  },
  countryLabel: { fontSize: 11, color: "#9CA3AF", fontFamily: "Inter_400Regular" },
  countryValue: { fontSize: 14, color: "#1A1A1A", fontFamily: "Inter_400Regular", marginTop: 2 },

  paypalHelpBtn: {
    marginLeft: "auto" as unknown as number,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#7B3FE4",
    alignItems: "center",
    justifyContent: "center",
  },

  cookiePref: { fontSize: 11, color: "#9CA3AF", fontFamily: "Inter_400Regular", marginTop: 8, marginBottom: 24 },

  billingCycleLabel: { fontSize: 14, color: "#374151", fontFamily: "Inter_500Medium", marginBottom: 8 },
  billingOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  billingOptionSelected: { borderColor: "#1A1A1A" },
  billingOptionLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginBottom: 18,
  },
  billingOptionText: { fontSize: 15, fontFamily: "Inter_500Medium", color: "#1A1A1A" },
  saveBadge: {
    backgroundColor: "#DCFCE7",
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  saveBadgeText: { fontSize: 12, color: "#16A34A", fontFamily: "Inter_600SemiBold" },

  pricingRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 },
  pricingName: { fontSize: 15, fontFamily: "Inter_500Medium", color: "#1A1A1A" },
  pricingRight: { alignItems: "flex-end", gap: 2 },
  pricingStrike: { fontSize: 13, color: "#9CA3AF", fontFamily: "Inter_400Regular", textDecorationLine: "line-through" },
  pricingFree: { fontSize: 13, color: "#22C55E", fontFamily: "Inter_600SemiBold" },
  pricingAmount: { fontSize: 13, color: "#1A1A1A", fontFamily: "Inter_600SemiBold" },

  couponLink: { fontSize: 14, color: "#7B3FE4", fontFamily: "Inter_500Medium", marginBottom: 16 },

  divider: { height: 1, backgroundColor: "#F3F4F6", marginBottom: 14 },

  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: "#6B7280", fontFamily: "Inter_400Regular" },
  summaryValue: { fontSize: 14, color: "#1A1A1A", fontFamily: "Inter_500Medium" },

  dueTodayRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  dueTodayLabel: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#1A1A1A" },
  dueTodayAmount: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#1A1A1A" },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#1A1A1A" },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    gap: 10,
    backgroundColor: "#FFFFFF",
  },
  ctaBtn: {
    backgroundColor: "#7B3FE4",
    borderRadius: 50,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  ctaBtnText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" },
  footerNote: { fontSize: 12, color: "#9CA3AF", fontFamily: "Inter_400Regular", textAlign: "center" },
});
