import { Feather, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
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

const { width } = Dimensions.get("window");

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
  const radius = 82;

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

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: Math.cos(angle.value) * radius },
      { translateY: Math.sin(angle.value) * radius },
    ],
  }));

  const renderIcon = () => {
    switch (platformId) {
      case "instagram":
        return <MaterialCommunityIcons name="instagram" size={18} color={color} />;
      case "tiktok":
        return <MaterialCommunityIcons name="music-note" size={18} color={color} />;
      case "youtube":
        return <FontAwesome5 name="youtube" size={16} color={color} />;
      case "spotify":
        return <FontAwesome5 name="spotify" size={16} color={color} />;
      default:
        return <Feather name="globe" size={16} color={color} />;
    }
  };

  return (
    <Animated.View style={[styles.orbitIcon, animStyle]}>
      {renderIcon()}
    </Animated.View>
  );
}

export default function AILoadingScreen() {
  const insets = useSafeAreaInsets();
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const progressAnim = useSharedValue(0);
  const pulseAnim = useSharedValue(1);
  const glowAnim = useSharedValue(0.4);
  const charIndexRef = useRef(0);
  const msgIndexRef = useRef(0);
  const typeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTyping = (msg: string) => {
    if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
    charIndexRef.current = 0;
    setDisplayedText("");
    typeIntervalRef.current = setInterval(() => {
      charIndexRef.current++;
      setDisplayedText(msg.slice(0, charIndexRef.current));
      if (charIndexRef.current >= msg.length) {
        if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
      }
    }, 38);
  };

  useEffect(() => {
    // Progress animation
    progressAnim.value = withTiming(1, { duration: 4200, easing: Easing.out(Easing.cubic) });

    // Pulse
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Glow
    glowAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Start first message typewriter
    startTyping(MESSAGES[0]);

    // Cycle messages with typewriter
    const msgInterval = setInterval(() => {
      msgIndexRef.current = Math.min(msgIndexRef.current + 1, MESSAGES.length - 1);
      setMessageIndex(msgIndexRef.current);
      startTyping(MESSAGES[msgIndexRef.current]);
    }, 1400);

    // Auto-navigate
    const navTimeout = setTimeout(() => {
      router.replace("/ai-preview");
    }, 4600);

    return () => {
      clearInterval(msgInterval);
      clearTimeout(navTimeout);
      if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
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
      {/* Particle dots */}
      {Array.from({ length: 20 }).map((_, i) => {
        const SCREEN_W = Dimensions.get("window").width;
        const SCREEN_H = Dimensions.get("window").height;
        const leftFrac = ((i * 37 + 10) % 90) / 100;
        const topFrac = ((i * 53 + 15) % 85) / 100;
        return (
          <View
            key={i}
            style={[
              styles.particle,
              {
                left: leftFrac * SCREEN_W,
                top: topFrac * SCREEN_H,
                opacity: 0.12 + (i % 5) * 0.06,
                width: 2 + (i % 3),
                height: 2 + (i % 3),
              },
            ]}
          />
        );
      })}

      <View style={styles.centerSection}>
        {/* Orbit system */}
        <View style={styles.orbitContainer}>
          <Animated.View style={[styles.orbGlow, glowStyle]} />

          {PLATFORMS.map((p, i) => (
            <PlatformOrbitIcon
              key={p.id}
              index={i}
              total={PLATFORMS.length}
              platformId={p.id}
              color={p.color}
            />
          ))}

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

        {/* Typewriter message */}
        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            {displayedText}
            <Text style={styles.cursor}>|</Text>
          </Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressBarStyle]} />
        </View>
      </View>

      {/* Footer */}
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
  centerSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
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
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#C5E84F",
    opacity: 0.2,
  },
  orbitIcon: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
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
  messageContainer: {
    minHeight: 56,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  message: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "Inter_500Medium",
    textAlign: "center",
    lineHeight: 26,
  },
  cursor: {
    color: "#C5E84F",
    fontSize: 18,
    fontFamily: "Inter_400Regular",
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
    color: "rgba(255,255,255,0.35)",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 18,
  },
});
