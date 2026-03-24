import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
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

const SCREEN_W = Dimensions.get("window").width;

const MARQUEE_ITEMS = [
  "Koy Sun. Lettering artist and illustrator.",
  "Studio Clay",
  "Shaep",
  "Nova Reyes",
  "TravelWithKoysun",
  "Studio Clay",
];
const MARQUEE_TEXT = MARQUEE_ITEMS.join("  ·  ") + "  ·  ";

function MarqueeStrip() {
  const translateX = useRef(new Animated.Value(0)).current;
  const textWidth = MARQUEE_TEXT.length * 8.5;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(translateX, {
        toValue: -textWidth,
        duration: textWidth * 22,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    );
    anim.start();
    return () => anim.stop();
  }, [textWidth, translateX]);

  return (
    <View style={styles.marqueeStrip}>
      <Animated.View
        style={[styles.marqueeInner, { transform: [{ translateX }] }]}
      >
        {[0, 1, 2].map((i) => (
          <Text key={i} style={styles.marqueeText}>
            {MARQUEE_TEXT}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
}

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
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* ── Lime-green hero zone ────────────────────── */}
        <View
          style={[
            styles.heroZone,
            { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) + 12 },
          ]}
        >
          {/* Floating pill navbar */}
          <View style={styles.navPill}>
            <View style={styles.logoRow}>
              <View style={styles.asteriskBox}>
                <Text style={styles.asterisk}>*</Text>
              </View>
            </View>
            <View style={styles.navActions}>
              <Pressable style={styles.loginBtn}>
                <Text style={styles.loginText}>Log in</Text>
              </Pressable>
              <Pressable style={styles.signupBtn} onPress={handleGetStarted}>
                <Text style={styles.signupText}>Sign up free</Text>
              </Pressable>
              <View style={styles.hamburger}>
                <View style={styles.hamburgerLine} />
                <View style={styles.hamburgerLine} />
                <View style={[styles.hamburgerLine, { width: 14 }]} />
              </View>
            </View>
          </View>

          {/* Headline + subtitle */}
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              {"A link in bio\nbuilt for you."}
            </Text>
            <Text style={styles.heroSubtitle}>
              Join 70M+ people using Linktree for their link in bio. One link to
              help you share everything you create, curate and sell from your
              Instagram, TikTok, Twitter, YouTube and other social media
              profiles.
            </Text>

            {/* URL input */}
            <View
              style={[
                styles.inputWrapper,
                inputFocused && styles.inputWrapperFocused,
              ]}
            >
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

            {/* CTA button */}
            <Pressable
              style={({ pressed }) => [
                styles.ctaButton,
                pressed && styles.ctaButtonPressed,
              ]}
              onPress={handleGetStarted}
            >
              <Text style={styles.ctaButtonText}>Get started for free</Text>
            </Pressable>
          </View>

          {/* Hero lifestyle image */}
          <Image
            source={require("../assets/images/homepage1.png")}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        {/* ── Marquee strip ───────────────────────────── */}
        <MarqueeStrip />

        {/* ── Blue "Create and customize" section ─────── */}
        <View style={styles.blueSection}>
          <Text style={styles.blueSectionTitle}>
            Create and customize your Linktree in minutes
          </Text>
          <Text style={styles.blueSectionBody}>
            Connect all your content across social media, websites, stores and
            more in one link in bio. Customize every detail or let Linktree
            automatically enhance it to match your brand and drive more clicks.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.blueCtaBtn,
              pressed && styles.ctaButtonPressed,
            ]}
            onPress={handleGetStarted}
          >
            <Text style={styles.blueCtaText}>Get started for free</Text>
          </Pressable>

          {/* Product mockup image */}
          <Image
            source={require("../assets/images/homepage2.png")}
            style={styles.mockupImage}
            resizeMode="cover"
          />
        </View>

        <View style={{ height: insets.bottom + (Platform.OS === "web" ? 34 : 20) }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#C5E84F" },
  container: { flexGrow: 1, backgroundColor: "#FFFFFF" },

  heroZone: {
    backgroundColor: "#C5E84F",
    paddingHorizontal: 16,
    paddingBottom: 0,
  },

  navPill: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  logoRow: { flexDirection: "row", alignItems: "center" },
  asteriskBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#C5E84F",
    alignItems: "center",
    justifyContent: "center",
  },
  asterisk: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1D3C34",
    fontFamily: "DM_Sans_700Bold",
    lineHeight: 28,
  },
  navActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  loginBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    backgroundColor: "transparent",
  },
  loginText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "DM_Sans_500Medium",
  },
  signupBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#1D3C34",
  },
  signupText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "DM_Sans_500Medium",
  },
  hamburger: { gap: 4, paddingLeft: 4 },
  hamburgerLine: {
    width: 18,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#1A1A1A",
  },

  heroContent: { paddingHorizontal: 4 },
  heroTitle: {
    fontSize: 44,
    fontWeight: "900",
    color: "#1D3C34",
    fontFamily: "DM_Sans_700Bold",
    lineHeight: 50,
    marginBottom: 18,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 15,
    color: "#2A4A3A",
    fontFamily: "DM_Sans_400Regular",
    lineHeight: 23,
    marginBottom: 28,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  inputWrapperFocused: { borderColor: "#1D3C34" },
  inputPrefix: {
    fontSize: 16,
    color: "#9CA3AF",
    fontFamily: "DM_Sans_400Regular",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
    fontFamily: "DM_Sans_500Medium",
    padding: 0,
  },
  ctaButton: {
    backgroundColor: "#1D3C34",
    borderRadius: 50,
    paddingVertical: 17,
    alignItems: "center",
    marginBottom: 28,
  },
  ctaButtonPressed: { opacity: 0.85 },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "DM_Sans_700Bold",
  },

  heroImage: {
    width: SCREEN_W - 32,
    height: 260,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignSelf: "center",
  },

  marqueeStrip: {
    backgroundColor: "#E8F5DC",
    paddingVertical: 11,
    overflow: "hidden",
  },
  marqueeInner: { flexDirection: "row" },
  marqueeText: {
    fontSize: 13,
    color: "#2A4A3A",
    fontFamily: "DM_Sans_400Regular",
    letterSpacing: 0.2,
  },

  blueSection: {
    backgroundColor: "#3D4FDB",
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 0,
  },
  blueSectionTitle: {
    fontSize: 34,
    fontWeight: "900",
    color: "#C5E84F",
    fontFamily: "DM_Sans_700Bold",
    lineHeight: 40,
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  blueSectionBody: {
    fontSize: 15,
    color: "#FFFFFF",
    fontFamily: "DM_Sans_400Regular",
    lineHeight: 23,
    marginBottom: 32,
    textAlign: "left",
  },
  blueCtaBtn: {
    backgroundColor: "#C5E84F",
    borderRadius: 50,
    paddingVertical: 17,
    alignItems: "center",
    marginBottom: 40,
  },
  blueCtaText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1D3C34",
    fontFamily: "DM_Sans_700Bold",
  },

  mockupImage: {
    width: SCREEN_W - 48,
    height: 280,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignSelf: "center",
  },
});
