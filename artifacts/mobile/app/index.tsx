import { Video, ResizeMode } from "expo-av";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
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
import { SvgXml } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useOnboarding } from "@/context/OnboardingContext";

const SCREEN_W = Dimensions.get("window").width;

const LINKTREE_MARK_SVG = `<svg viewBox="984 0 192 238" xmlns="http://www.w3.org/2000/svg"><path d="M984.643 79.1509H1042.56L1001.32 40.1226L1024.05 16.9609L1063.28 57.0835V0H1097.37V57.0835L1136.59 16.9609L1159.32 40.1226L1118.08 79.1509H1176V111.431H1117.71L1159.14 151.554L1136.41 174.169L1080.14 117.815L1023.87 174.169L1001.14 151.554L1042.56 111.431H984.277V79.1509H984.643ZM1063.46 157.572H1097.55V234.17H1063.46V157.572Z"/></svg>`;

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
            {
              paddingTop:
                insets.top + (Platform.OS === "web" ? 67 : 12) + 12,
            },
          ]}
        >
          {/* Floating pill navbar */}
          <View style={styles.navPill}>
            <SvgXml xml={LINKTREE_MARK_SVG} width={30} height={36} />

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

          {/* Hero copy */}
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              {"A link in bio\nbuilt for you."}
            </Text>
            <Text style={styles.heroSubtitle}>
              Join 70M+ people using Linktree for their link in bio. One link
              to help you share everything you create, curate and sell from your
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

        {/* ── Blue section ─────────────────────────────── */}
        <View style={styles.blueSection}>
          <Text style={styles.blueSectionTitle}>
            Automatically create your Linktree in seconds
          </Text>
          <Text style={styles.blueSectionBody}>
            Connect all your content across social media, websites, stores and
            more in one link in bio. Linktree automatically creates your page
            to match your brand and get more clicks, customize it from there.
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

          {/* Product demo video */}
          <Video
            source={require("../assets/images/customize_linktree.mp4")}
            style={styles.demoVideo}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping
            isMuted
            useNativeControls={false}
          />
        </View>

        <View
          style={{
            height: insets.bottom + (Platform.OS === "web" ? 34 : 20),
          }}
        />
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  navActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loginBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#EFEFEF",
  },
  loginText: {
    fontSize: 15,
    color: "#1A1A1A",
    fontFamily: "DMSans_500Medium",
  },
  signupBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 50,
    backgroundColor: "#1A1A1A",
  },
  signupText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontFamily: "DMSans_500Medium",
  },
  hamburger: { gap: 4, paddingLeft: 2 },
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
    fontFamily: "DMSans_700Bold",
    lineHeight: 50,
    marginBottom: 18,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 15,
    color: "#2A4A3A",
    fontFamily: "DMSans_400Regular",
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
    fontFamily: "DMSans_400Regular",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
    fontFamily: "DMSans_500Medium",
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
    fontFamily: "DMSans_700Bold",
  },
  heroImage: {
    width: SCREEN_W - 32,
    height: 260,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignSelf: "center",
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
    fontFamily: "DMSans_700Bold",
    lineHeight: 40,
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  blueSectionBody: {
    fontSize: 15,
    color: "#FFFFFF",
    fontFamily: "DMSans_400Regular",
    lineHeight: 23,
    marginBottom: 32,
  },
  blueCtaBtn: {
    backgroundColor: "#C5E84F",
    borderRadius: 50,
    paddingVertical: 17,
    alignItems: "center",
    marginBottom: 36,
  },
  blueCtaText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1D3C34",
    fontFamily: "DMSans_700Bold",
  },
  demoVideo: {
    width: SCREEN_W - 48,
    height: 320,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignSelf: "center",
    overflow: "hidden",
  },
});
