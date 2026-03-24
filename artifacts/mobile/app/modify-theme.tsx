import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const THEMES = [
  {
    id: "nova-earth",
    name: "Nova Earth",
    creator: "novaonthemove",
    bio: "Travel • Lifestyle • Adventure",
    colors: ["#C9614A", "#E8A87C"] as [string, string],
    buttonColor: "rgba(255,255,255,0.3)",
    textColor: "#FFFFFF",
    aiRecommended: true,
  },
  {
    id: "midnight",
    name: "Midnight",
    creator: "Jesse Jordan",
    bio: "Creator & Storyteller",
    colors: ["#0D0D0D", "#1A1A2E"] as [string, string],
    buttonColor: "rgba(255,255,255,0.12)",
    textColor: "#FFFFFF",
    aiRecommended: false,
  },
  {
    id: "sunset-blush",
    name: "Sunset Blush",
    creator: "Mindy Frauke",
    bio: "Community artist & storyteller",
    colors: ["#F7C5B0", "#F0A090"] as [string, string],
    buttonColor: "rgba(255,255,255,0.4)",
    textColor: "#6B3020",
    aiRecommended: false,
  },
  {
    id: "forest-deep",
    name: "Forest Deep",
    creator: "Roberto Leopoldo",
    bio: "Nature · Design · Art",
    colors: ["#1B4332", "#2D6A4F"] as [string, string],
    buttonColor: "rgba(197, 232, 79, 0.3)",
    textColor: "#FFFFFF",
    aiRecommended: false,
  },
  {
    id: "minimal-gray",
    name: "Minimal Gray",
    creator: "Salka Ruslan",
    bio: "Minimal. Clean. Simple.",
    colors: ["#F5F5F5", "#EBEBEB"] as [string, string],
    buttonColor: "rgba(0,0,0,0.08)",
    textColor: "#1A1A1A",
    aiRecommended: false,
  },
  {
    id: "cocoa-stripe",
    name: "Cocoa Stripe",
    creator: "Monica Vera",
    bio: "Daily rituals & slow living",
    colors: ["#5C4033", "#7A5C4A"] as [string, string],
    buttonColor: "rgba(255,255,255,0.15)",
    textColor: "#F5EBE0",
    aiRecommended: false,
  },
  {
    id: "berry-night",
    name: "Berry Night",
    creator: "Newlove Store",
    bio: "Vintage, always.",
    colors: ["#3B1F3A", "#5A2D5A"] as [string, string],
    buttonColor: "rgba(255,255,255,0.15)",
    textColor: "#FFFFFF",
    aiRecommended: false,
  },
  {
    id: "lime-fresh",
    name: "Lime Fresh",
    creator: "Green Creator",
    bio: "Sustainability & lifestyle",
    colors: ["#C5E84F", "#A8CC2A"] as [string, string],
    buttonColor: "rgba(29,60,52,0.2)",
    textColor: "#1D3C34",
    aiRecommended: false,
  },
];

function ThemeMiniCard({
  theme,
  isSelected,
  onPress,
}: {
  theme: (typeof THEMES)[0];
  isSelected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.themeCard, isSelected && styles.themeCardSelected]}
      onPress={onPress}
    >
      {theme.aiRecommended && (
        <View style={styles.aiRecommendedBadge}>
          <Feather name="zap" size={10} color="#7B3FE4" />
          <Text style={styles.aiRecommendedText}>AI Pick</Text>
        </View>
      )}
      <LinearGradient
        colors={theme.colors}
        style={styles.themeGradient}
      >
        {/* Avatar placeholder */}
        <View style={[styles.miniAvatar, { borderColor: theme.textColor === "#FFFFFF" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.2)" }]} />
        <Text style={[styles.miniCreator, { color: theme.textColor }]} numberOfLines={1}>
          {theme.creator}
        </Text>
        <Text style={[styles.miniBio, { color: theme.textColor + "BB" }]} numberOfLines={1}>
          {theme.bio}
        </Text>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.miniLinkBar, { backgroundColor: theme.buttonColor }]} />
        ))}
      </LinearGradient>
      {isSelected && (
        <View style={styles.selectedCheck}>
          <Feather name="check" size={14} color="#FFFFFF" />
        </View>
      )}
    </Pressable>
  );
}

export default function ModifyThemeScreen() {
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState("nova-earth");

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Feather name="chevron-left" size={22} color="#7B3FE4" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Select a theme</Text>
          <Text style={styles.headerSub}>Pick the style that feels right</Text>
        </View>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      {/* AI recommendation note */}
      <View style={styles.aiNote}>
        <Feather name="zap" size={14} color="#7B3FE4" />
        <Text style={styles.aiNoteText}>
          AI recommended <Text style={{ fontFamily: "Inter_700Bold" }}>Nova Earth</Text> based on your warm, travel-lifestyle aesthetic
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {THEMES.map((theme) => (
          <ThemeMiniCard
            key={theme.id}
            theme={theme}
            isSelected={selectedId === theme.id}
            onPress={() => setSelectedId(theme.id)}
          />
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16) }]}>
        <Pressable
          style={({ pressed }) => [styles.applyBtn, pressed && { opacity: 0.85 }]}
          onPress={() => router.back()}
        >
          <Text style={styles.applyBtnText}>Start with this template</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: { width: 36, alignItems: "center" },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Inter_700Bold",
  },
  headerSub: {
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: "Inter_400Regular",
  },
  skipText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontFamily: "Inter_500Medium",
    width: 36,
    textAlign: "right",
  },
  aiNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#F0E8FF",
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  aiNoteText: {
    flex: 1,
    fontSize: 13,
    color: "#4B0082",
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  themeCard: {
    width: "46.5%",
    borderRadius: 16,
    overflow: "visible",
    borderWidth: 3,
    borderColor: "transparent",
    position: "relative",
  },
  themeCardSelected: {
    borderColor: "#7B3FE4",
  },
  aiRecommendedBadge: {
    position: "absolute",
    top: -10,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#F0E8FF",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    zIndex: 10,
    borderWidth: 1,
    borderColor: "#DDD0FF",
  },
  aiRecommendedText: {
    fontSize: 10,
    color: "#7B3FE4",
    fontFamily: "Inter_700Bold",
  },
  themeGradient: {
    borderRadius: 13,
    padding: 14,
    gap: 5,
    minHeight: 160,
  },
  miniAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderWidth: 2,
    alignSelf: "center",
    marginBottom: 2,
  },
  miniCreator: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  miniBio: {
    fontSize: 9,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginBottom: 6,
  },
  miniLinkBar: {
    height: 20,
    borderRadius: 6,
    marginVertical: 2,
  },
  selectedCheck: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#7B3FE4",
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  applyBtn: {
    backgroundColor: "#1D3C34",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  applyBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
  },
});
