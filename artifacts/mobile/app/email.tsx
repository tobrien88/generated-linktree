import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useOnboarding } from "@/context/OnboardingContext";

export default function EmailScreen() {
  const insets = useSafeAreaInsets();
  const { username, email, setEmail } = useOnboarding();
  const [focused, setFocused] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) }]}>
        {/* Logo */}
        <View style={styles.logoRow}>
          <Text style={styles.logoAsterisk}>*</Text>
          <Text style={styles.logoText}>Linktree</Text>
        </View>

        {/* Progress */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: "40%" }]} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.claimTitle}>Claim @{username}</Text>
          <Text style={styles.claimSubtitle}>on Linktree today</Text>
          <Text style={styles.signupLabel}>Sign up for free!</Text>

          <TextInput
            style={[styles.emailInput, focused && styles.emailInputFocused]}
            value={email}
            onChangeText={setEmail}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Pressable
            style={({ pressed }) => [
              styles.continueBtn,
              !email && styles.continueBtnDisabled,
              pressed && { opacity: 0.85 },
            ]}
            onPress={() => router.push("/social-platforms")}
            disabled={!email}
          >
            <Text style={styles.continueBtnText}>Continue</Text>
          </Pressable>

          <Text style={styles.legalText}>
            By clicking <Text style={styles.bold}>Create account</Text>, you agree to Linktree's{" "}
            <Text style={styles.link}>privacy notice</Text>,{" "}
            <Text style={styles.link}>T&Cs</Text> and to receive offers, news and updates.
          </Text>

          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>

          {/* OAuth buttons */}
          <Pressable style={({ pressed }) => [styles.oauthBtn, pressed && { opacity: 0.85 }]}>
            <View style={styles.googleIcon}>
              <Text style={styles.googleG}>G</Text>
            </View>
            <Text style={styles.oauthText}>Continue with Google</Text>
          </Pressable>

          <Pressable style={({ pressed }) => [styles.oauthBtn, styles.appleBtn, pressed && { opacity: 0.85 }]}>
            <Feather name="smartphone" size={20} color="#FFFFFF" />
            <Text style={[styles.oauthText, { color: "#FFFFFF" }]}>Continue with Apple</Text>
          </Pressable>

          <View style={styles.loginRow}>
            <Text style={styles.loginLabel}>Already have an account? </Text>
            <Pressable>
              <Text style={styles.loginLink}>Log in</Text>
            </Pressable>
          </View>
        </View>

        <View style={{ height: insets.bottom + (Platform.OS === "web" ? 34 : 16) }} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 4,
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
  progressBar: {
    height: 4,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 20,
    borderRadius: 2,
    marginTop: 12,
    marginBottom: 0,
  },
  progressFill: {
    height: 4,
    backgroundColor: "#7B3FE4",
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  claimTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  claimSubtitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    marginBottom: 8,
  },
  signupLabel: {
    fontSize: 15,
    color: "#6B7280",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginBottom: 28,
  },
  emailInput: {
    backgroundColor: "#F8F7F5",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#1A1A1A",
    fontFamily: "Inter_400Regular",
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  emailInputFocused: {
    borderColor: "#7B3FE4",
    backgroundColor: "#FFFFFF",
  },
  continueBtn: {
    backgroundColor: "#1D3C34",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  continueBtnDisabled: {
    backgroundColor: "#E5E7EB",
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
  },
  legalText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 24,
  },
  bold: { fontFamily: "Inter_700Bold", color: "#6B7280" },
  link: { color: "#1A1A1A", textDecorationLine: "underline" },
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  orLine: { flex: 1, height: 1, backgroundColor: "#E5E7EB" },
  orText: {
    fontSize: 13,
    color: "#9CA3AF",
    fontFamily: "Inter_500Medium",
  },
  oauthBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },
  appleBtn: {
    backgroundColor: "#000000",
    borderColor: "#000000",
  },
  googleIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#4285F4",
    alignItems: "center",
    justifyContent: "center",
  },
  googleG: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
  },
  oauthText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Inter_600SemiBold",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  loginLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "Inter_400Regular",
  },
  loginLink: {
    fontSize: 14,
    color: "#7B3FE4",
    fontFamily: "Inter_600SemiBold",
  },
});
