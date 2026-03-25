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

export default function UsernameScreen() {
  const insets = useSafeAreaInsets();
  const { username, setUsername } = useOnboarding();
  const [focused, setFocused] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === "web" ? 44 : 16) }]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
            <Feather name="chevron-left" size={22} color="#7B3FE4" />
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          {/* Progress bar */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "20%" }]} />
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Choose your username</Text>
          <Text style={styles.subtitle}>
            Try something similar to your social handles for easy recognition.
          </Text>

          <View style={[styles.inputRow, focused && styles.inputRowFocused]}>
            <Text style={styles.prefix}>linktr.ee/</Text>
            <TextInput
              style={[styles.input, Platform.OS === "web" && ({ outlineWidth: 0 } as object)]}
              value={username}
              onChangeText={setUsername}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              autoCapitalize="none"
              autoCorrect={false}
              underlineColorAndroid="transparent"
            />
          </View>

          {username.length > 0 && (
            <View style={styles.availableRow}>
              <Feather name="check-circle" size={16} color="#22C55E" />
              <Text style={styles.availableText}>linktr.ee/{username} is available</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16) }]}>
          <Pressable
            style={({ pressed }) => [
              styles.continueBtn,
              !username && styles.continueBtnDisabled,
              pressed && styles.continueBtnPressed,
            ]}
            onPress={() => router.push("/email")}
            disabled={!username}
          >
            <Text style={styles.continueBtnText}>Continue</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    gap: 16,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    alignSelf: "flex-start",
  },
  backText: {
    fontSize: 15,
    color: "#7B3FE4",
    fontFamily: "Inter_500Medium",
  },
  progressBar: {
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
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
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Inter_700Bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    marginBottom: 28,
    textAlign: "center",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F7F5",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  inputRowFocused: {
    borderColor: "#7B3FE4",
    backgroundColor: "#FFFFFF",
  },
  prefix: {
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
  availableRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  availableText: {
    fontSize: 13,
    color: "#22C55E",
    fontFamily: "Inter_500Medium",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  continueBtn: {
    backgroundColor: "#1D3C34",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  continueBtnDisabled: {
    backgroundColor: "#E5E7EB",
  },
  continueBtnPressed: {
    opacity: 0.85,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
  },
});
