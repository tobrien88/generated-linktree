import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
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
import { PlatformIcon, PLATFORM_COLORS } from "@/components/PlatformIcon";

function PlatformTileComponent({
  platform,
  onToggle,
  onHandleChange,
}: {
  platform: { id: string; name: string; handle: string; selected: boolean };
  onToggle: () => void;
  onHandleChange: (handle: string) => void;
}) {
  const expandAnim = useSharedValue(platform.selected ? 1 : 0);
  const bgColor = PLATFORM_COLORS[platform.id] ?? "#1D3C34";

  const handlePress = () => {
    const newSelected = !platform.selected;
    expandAnim.value = withSpring(newSelected ? 1 : 0, { damping: 16 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle();
  };

  const inputStyle = useAnimatedStyle(() => ({
    maxHeight: expandAnim.value * 52,
    opacity: expandAnim.value,
    overflow: "hidden",
  }));

  return (
    <View style={styles.tileContainer}>
      <Pressable
        onPress={handlePress}
        style={[styles.tile, platform.selected && styles.tileSelected]}
      >
        <View style={[styles.tileIcon, { backgroundColor: bgColor }]}>
          <PlatformIcon platformId={platform.id} size={20} color="#FFFFFF" />
        </View>
        <Text style={[styles.tileName, platform.selected && styles.tileNameSelected]}>
          {platform.name}
        </Text>
        {platform.selected && (
          <View style={styles.checkBadge}>
            <Feather name="check" size={10} color="#FFFFFF" />
          </View>
        )}
      </Pressable>

      <Animated.View style={[styles.handleInputWrapper, inputStyle]}>
        {platform.selected && (
          <TextInput
            style={styles.handleInput}
            value={platform.handle}
            onChangeText={onHandleChange}
            placeholder={platform.id === "website" ? "yourwebsite.com" : "@yourhandle"}
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}
      </Animated.View>
    </View>
  );
}

export default function SocialPlatformsScreen() {
  const insets = useSafeAreaInsets();
  const { platforms, togglePlatform, setPlatformHandle } = useOnboarding();
  const selectedCount = platforms.filter((p) => p.selected).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Feather name="chevron-left" size={22} color="#7B3FE4" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: "60%" }]} />
        </View>
        <View style={styles.headerRow}>
          <View />
          <Pressable onPress={() => router.push("/ai-loading")}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.aiTag}>
          <Feather name="zap" size={12} color="#7B3FE4" />
          <Text style={styles.aiTagText}>AI-powered profile generation</Text>
        </View>

        <Text style={styles.title}>Which platforms{"\n"}are you on?</Text>
        <Text style={styles.subtitle}>
          Tap to add your handles. Our AI will analyze your content to build your personalized Linktree.
        </Text>

        <View style={styles.grid}>
          {platforms.map((p) => (
            <PlatformTileComponent
              key={p.id}
              platform={p}
              onToggle={() => togglePlatform(p.id)}
              onHandleChange={(h) => setPlatformHandle(p.id, h)}
            />
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16) }]}>
        {selectedCount > 0 && (
          <Text style={styles.selectedCount}>
            {selectedCount} platform{selectedCount !== 1 ? "s" : ""} selected
          </Text>
        )}
        <Pressable
          style={({ pressed }) => [
            styles.continueBtn,
            selectedCount === 0 && styles.continueBtnDisabled,
            pressed && { opacity: 0.85 },
          ]}
          onPress={() => router.push("/ai-loading")}
          disabled={selectedCount === 0}
        >
          <Feather name="zap" size={18} color="#FFFFFF" />
          <Text style={styles.continueBtnText}>Analyze my profiles with AI</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: { paddingHorizontal: 20, paddingBottom: 0, gap: 10 },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 2, alignSelf: "flex-start" },
  backText: { fontSize: 15, color: "#7B3FE4", fontFamily: "Inter_500Medium" },
  progressBar: { height: 4, backgroundColor: "#E5E7EB", borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: "#7B3FE4", borderRadius: 2 },
  headerRow: { flexDirection: "row", justifyContent: "flex-end" },
  skipText: { fontSize: 14, color: "#9CA3AF", fontFamily: "Inter_500Medium" },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20 },
  aiTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#F0E8FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 14,
  },
  aiTagText: { fontSize: 12, color: "#7B3FE4", fontFamily: "Inter_600SemiBold" },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Inter_700Bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
    marginBottom: 24,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tileContainer: { width: "30%", minWidth: 100 },
  tile: {
    backgroundColor: "#F8F7F5",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    gap: 7,
    borderWidth: 2,
    borderColor: "transparent",
    position: "relative",
  },
  tileSelected: {
    borderColor: "#1D3C34",
    backgroundColor: "#F0F9F4",
  },
  tileIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tileName: {
    fontSize: 11,
    color: "#6B7280",
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  tileNameSelected: { color: "#1D3C34" },
  checkBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#1D3C34",
    alignItems: "center",
    justifyContent: "center",
  },
  handleInputWrapper: { marginTop: 4 },
  handleInput: {
    backgroundColor: "#F0F9F4",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 12,
    color: "#1A1A1A",
    fontFamily: "Inter_400Regular",
    borderWidth: 1,
    borderColor: "#C5E84F",
    height: 36,
  },
  footer: { paddingHorizontal: 20, paddingTop: 12, gap: 8 },
  selectedCount: {
    textAlign: "center",
    fontSize: 13,
    color: "#6B7280",
    fontFamily: "Inter_400Regular",
  },
  continueBtn: {
    backgroundColor: "#7B3FE4",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  continueBtnDisabled: { backgroundColor: "#E5E7EB" },
  continueBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
  },
});
