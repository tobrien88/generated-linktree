import { Feather, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const MESSAGES = [
  "Connecting to your profiles...",
  "Analyzing your TikTok content...",
  "Reading your Instagram aesthetic...",
  "Understanding your audience signals...",
  "Mapping your brand identity...",
  "Curating your best links...",
  "Matching your color palette...",
  "Crafting your personalized Linktree...",
  "Almost ready...",
];

const PLATFORMS = [
  { id: "instagram", color: "#E1306C" },
  { id: "tiktok", color: "#FFFFFF" },
  { id: "youtube", color: "#FF0000" },
  { id: "spotify", color: "#1DB954" },
  { id: "website", color: "#7B3FE4" },
];

function PlatformOrbitIcon({ index, total, platformId, color }: {
  index: number;
  total: number;
  platformId: string;
  color: string;
}) {
  const angle = useSharedValue((index / total) * Math.PI * 2);
  const radius = 80;

  useEffect(() => {
    angle.value = withRepeat(
      withTiming(angle.value + Math.PI * 2, {
        duration: 6000 + index * 500,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const animStyle = useAnimatedStyle(() => {
    const x = Math.cos(angle.value) * radius;
    const y = Math.sin(angle.value) * radius;
    return {
      transform: [{ translateX: x }, { translateY: y }],
    };
  });

  const iconProps = { size: 18, color };
  const icon = platformId === "instagram"
    ? <MaterialCommunityIcons name="instagram" {...iconProps} />
    : platformId === "tiktok"
    ? <MaterialCommunityIcons name="music-note" {...iconProps} />
    : platformId === "youtube"
    ? <FontAwesome5 name="youtube" {...iconProps} />
    : platformId === "spotify"
    ? <FontAwesome5 name="spotify" {...iconProps} />
    : <Feather name="globe" {...iconProps} />;

  return (
    <Animated.View style={[styles.orbitIcon, animStyle]}>
      {icon}
    </Animated.View>
  );
}

export default function AILoadingScreen() {
  const insets = useSafeAreaInsets();
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressAnim = useSharedValue(0);
  const pulseAnim = useSharedValue(1);
  const glowAnim = useSharedValue(0);

  useEffect(() => {
    // Progress animation
    progressAnim.value = withTiming(1, { duration: 4200, easing: Easing.out(Easing.cubic) });

    // Pulse animation for center orb
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Glow animation
    glowAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Cycle messages
    let idx = 0;
    const msgInterval = setInterval(() => {
      idx = Math.min(idx + 1, MESSAGES.length - 1);
      setMessageIndex(idx);
    }, 500);

    // Auto-navigate after 4.5 seconds
    const navTimeout = setTimeout(() => {
      router.replace("/ai-preview");
    }, 4500);

    return () => {
      clearInterval(msgInterval);
      clearTimeout(navTimeout);
    };
  }, []);

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressAnim.value * 100}%`,
  }));

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowAnim.value,
  }));

  return (
    <LinearGradient
      colors={["#0A0A14", "#0F0A22", "#120825"]}
      style={[styles.container, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) }]}
    >
      {/* Particle dots background */}
      {Array.from({ length: 20 }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.particle,
            {
              left: `${(i * 37 + 10) % 90}%` as any,
              top: `${(i * 53 + 15) % 85}%` as any,
              opacity: 0.15 + (i % 5) * 0.08,
              width: 2 + (i % 3),
              height: 2 + (i % 3),
            },
          ]}
        />
      ))}

      {/* Neural connection lines hint */}
      <View style={styles.scanLine} />
      <View style={[styles.scanLine, { top: "45%", opacity: 0.04 }]} />

      <View style={styles.centerSection}>
        {/* Orbit system */}
        <View style={styles.orbitContainer}>
          {/* Glow behind orb */}
          <Animated.View style={[styles.orbGlow, glowStyle]} />

          {/* Orbiting platforms */}
          {PLATFORMS.map((p, i) => (
            <PlatformOrbitIcon
              key={p.id}
              index={i}
              total={PLATFORMS.length}
              platformId={p.id}
              color={p.color}
            />
          ))}

          {/* Center orb */}
          <Animated.View style={[styles.centerOrb, orbStyle]}>
            <LinearGradient
              colors={["#C5E84F", "#8FCC20"]}
              style={styles.centerOrbGradient}
            >
              <Text style={styles.centerOrbAsterisk}>*</Text>
            </LinearGradient>
          </Animated.View>
        </View>

        {/* AI label */}
        <View style={styles.aiLabel}>
          <View style={styles.aiDot} />
          <Text style={styles.aiLabelText}>AI ANALYSIS IN PROGRESS</Text>
        </View>

        {/* Message */}
        <Text style={styles.message}>{MESSAGES[messageIndex]}</Text>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressBarStyle]} />
        </View>
      </View>

      {/* Footer info */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 24) }]}>
        <Text style={styles.footerText}>
          Analyzing {PLATFORMS.length} connected profiles to build your personalized Linktree
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  particle: {
    position: "absolute",
    borderRadius: 99,
    backgroundColor: "#7B3FE4",
  },
  scanLine: {
    position: "absolute",
    top: "30%",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#C5E84F",
    opacity: 0.06,
  },
  centerSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 28,
    paddingHorizontal: 40,
  },
  orbitContainer: {
    width: 220,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  orbGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#C5E84F",
    opacity: 0.2,
  },
  orbitIcon: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  centerOrb: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: "hidden",
  },
  centerOrbGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centerOrbAsterisk: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1D3C34",
    fontFamily: "Inter_700Bold",
  },
  aiLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  aiDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#C5E84F",
  },
  aiLabelText: {
    fontSize: 11,
    color: "#C5E84F",
    fontFamily: "Inter_700Bold",
    letterSpacing: 2,
  },
  message: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "Inter_500Medium",
    textAlign: "center",
    lineHeight: 26,
    minHeight: 52,
  },
  progressTrack: {
    width: "100%",
    height: 3,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: 3,
    backgroundColor: "#C5E84F",
    borderRadius: 2,
  },
  footer: {
    paddingHorizontal: 40,
    alignItems: "center",
  },
  footerText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.4)",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 18,
  },
});
