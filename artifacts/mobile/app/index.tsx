import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
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

export default function LandingScreen() {
  const insets = useSafeAreaInsets();
  const { username, setUsername } = useOnboarding();
  const [inputFocused, setInputFocused] = useState(false);

  const handleGetStarted = () => {
    router.push("/username");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Navigation bar */}
        <View style={styles.navbar}>
          <View style={styles.logoRow}>
            <Text style={styles.logoAsterisk}>*</Text>
            <Text style={styles.logoText}>Linktree</Text>
          </View>
          <View style={styles.navActions}>
            <Pressable style={styles.loginBtn}>
              <Text style={styles.loginText}>Log in</Text>
            </Pressable>
            <Pressable style={styles.signupBtn} onPress={handleGetStarted}>
              <Text style={styles.signupText}>Sign up free</Text>
            </Pressable>
          </View>
        </View>

        {/* Hero section */}
        <LinearGradient
          colors={["#C5E84F", "#B8DA40"]}
          style={styles.hero}
        >
          <Text style={styles.heroTitle}>
            A link in bio{"\n"}built for you.
          </Text>
          <Text style={styles.heroSubtitle}>
            Join 70M+ people using Linktree. Now with AI that builds your
            profile automatically from your social signals.
          </Text>

          {/* URL Input */}
          <View style={[styles.inputWrapper, inputFocused && styles.inputWrapperFocused]}>
            <Text style={styles.inputPrefix}>linktr.ee/</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="yourname"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.ctaButton,
              pressed && styles.ctaButtonPressed,
            ]}
            onPress={handleGetStarted}
          >
            <Text style={styles.ctaButtonText}>Get started for free</Text>
          </Pressable>
        </LinearGradient>

        {/* AI Feature callout */}
        <View style={styles.aiCallout}>
          <View style={styles.aiCalloutInner}>
            <View style={styles.aiIcon}>
              <Feather name="zap" size={18} color="#7B3FE4" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.aiCalloutTitle}>AI-powered profile generation</Text>
              <Text style={styles.aiCalloutBody}>
                Connect your social profiles and let our AI build your personalized Linktree — bio, theme, links and all.
              </Text>
            </View>
          </View>
        </View>

        {/* Feature grid */}
        <View style={styles.featuresGrid}>
          {[
            { icon: "link-2" as const, label: "All your links" },
            { icon: "trending-up" as const, label: "Analytics" },
            { icon: "dollar-sign" as const, label: "Sell products" },
            { icon: "zap" as const, label: "AI-generated" },
          ].map((f) => (
            <View key={f.label} style={styles.featureItem}>
              <View style={styles.featureIconBg}>
                <Feather name={f.icon} size={20} color="#1D3C34" />
              </View>
              <Text style={styles.featureLabel}>{f.label}</Text>
            </View>
          ))}
        </View>

        {/* Bottom padding */}
        <View style={{ height: insets.bottom + (Platform.OS === "web" ? 34 : 20) }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { flexGrow: 1, backgroundColor: "#FFFFFF" },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  logoAsterisk: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1D3C34",
    fontFamily: "Inter_700Bold",
  },
  logoText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1D3C34",
    fontFamily: "Inter_700Bold",
  },
  navActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loginBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  loginText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Inter_600SemiBold",
  },
  signupBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    backgroundColor: "#1D3C34",
  },
  signupText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "Inter_600SemiBold",
  },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 36,
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: "800",
    color: "#1D3C34",
    fontFamily: "Inter_700Bold",
    lineHeight: 46,
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#2A5244",
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
    marginBottom: 28,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: "transparent",
  },
  inputWrapperFocused: {
    borderColor: "#1D3C34",
  },
  inputPrefix: {
    fontSize: 16,
    color: "#9CA3AF",
    fontFamily: "Inter_400Regular",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
    fontFamily: "Inter_500Medium",
    padding: 0,
  },
  ctaButton: {
    backgroundColor: "#1D3C34",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  ctaButtonPressed: {
    opacity: 0.85,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
  },
  aiCallout: {
    margin: 20,
    borderRadius: 16,
    backgroundColor: "#F0E8FF",
    overflow: "hidden",
  },
  aiCalloutInner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
  },
  aiIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  aiCalloutTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  aiCalloutBody: {
    fontSize: 13,
    color: "#6B7280",
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
  },
  featureItem: {
    width: "46%",
    backgroundColor: "#F8F7F5",
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  featureIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#C5E84F",
    alignItems: "center",
    justifyContent: "center",
  },
  featureLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Inter_600SemiBold",
  },
});
