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

const LINKTREE_LOGO_SVG = `<svg viewBox="0 0 1176 238" xmlns="http://www.w3.org/2000/svg"><path d="M0 25.5326H33.7257V202.802H127.205V233.988H0V25.5326ZM160.564 25.5326C172.111 25.5326 181.642 34.469 181.642 45.9586C181.642 57.6307 172.111 66.9318 160.564 66.9318C148.833 66.9318 139.485 57.6307 139.485 45.9586C139.485 34.469 148.833 25.5326 160.564 25.5326ZM144.067 83.7103H176.51V233.988H144.067V83.7103ZM195.572 83.7103H228.015V104.501C237.546 88.6345 254.042 79.6981 275.854 79.6981C311.046 79.6981 333.041 107.054 333.041 150.46V233.988H300.598V153.378C300.598 125.292 288.318 109.425 265.956 109.425C241.579 109.425 228.015 126.021 228.015 156.113V233.988H195.572V83.7103ZM350.087 25.5326H382.53V157.39L443.016 83.8927H483.707L419.188 159.031L483.707 233.988H443.016L382.53 160.673V233.988H350.087V25.5326ZM496.354 45.4114H529.347V83.7103H567.838V110.519H529.347V187.847C529.347 197.695 535.395 203.713 544.743 203.713H566.372V233.988H540.344C512.117 233.988 496.354 217.392 496.354 187.847V45.4114ZM584.5 83.7103H614.577V102.313C622.642 88.0873 636.022 79.6981 652.519 79.6981C657.468 79.6981 660.217 79.8805 663.883 81.1571V111.249C661.683 110.702 658.384 110.155 651.786 110.155C627.958 110.155 614.761 130.034 614.761 164.503V233.988H582.318V83.7103H584.5ZM739.582 79.6981C775.324 79.6981 813.999 101.218 813.999 162.314V166.691H697.792C700.358 193.5 715.938 208.273 741.965 208.273C760.661 208.273 776.607 198.242 780.09 184.199H813.082C809.783 214.291 778.44 238 741.965 238C695.226 238 665.899 207.726 665.899 158.667C665.899 115.261 694.309 79.6981 739.582 79.6981ZM779.54 139.882C774.958 121.28 760.294 109.608 739.766 109.608C719.97 109.608 706.04 121.644 700.541 139.882H779.54ZM902.162 79.6981C937.904 79.6981 976.578 101.218 976.578 162.314V166.691H860.372C862.938 193.5 878.517 208.273 904.545 208.273C923.241 208.273 939.187 198.242 942.669 184.199H975.662C972.363 214.291 941.02 238 904.545 238C857.805 238 828.479 207.726 828.479 158.667C828.479 115.261 856.706 79.6981 902.162 79.6981ZM941.936 139.882C937.354 121.28 922.691 109.608 901.979 109.608C882.183 109.608 868.253 121.644 862.754 139.882H941.936ZM984.643 79.1509H1042.56L1001.32 40.1226L1024.05 16.9609L1063.28 57.0835V0H1097.37V57.0835L1136.59 16.9609L1159.32 40.1226L1118.08 79.1509H1176V111.431H1117.71L1159.14 151.554L1136.41 174.169L1080.14 117.815L1023.87 174.169L1001.14 151.554L1042.56 111.431H984.277V79.1509H984.643ZM1063.46 157.572H1097.55V234.17H1063.46V157.572Z"/></svg>`;

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
            <SvgXml xml={LINKTREE_LOGO_SVG} width={108} height={22} />

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
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    backgroundColor: "transparent",
  },
  loginText: {
    fontSize: 13,
    color: "#1A1A1A",
    fontFamily: "DMSans_500Medium",
  },
  signupBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#1D3C34",
  },
  signupText: {
    fontSize: 13,
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
