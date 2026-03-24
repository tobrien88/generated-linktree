import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Link = {
  id: string;
  title: string;
  url: string;
  color: string;
  icon: string;
  enabled: boolean;
};

const DEFAULT_LINKS: Link[] = [
  { id: "1", title: "Free SE Asia Travel Guide", url: "linktr.ee/novaonthemove/seasia", color: "#F97316", icon: "map", enabled: true },
  { id: "2", title: "Follow me on TikTok", url: "tiktok.com/@novaonthemove", color: "#010101", icon: "play-circle", enabled: true },
  { id: "3", title: "My Lightroom Preset Pack", url: "novaonthemove.com/presets", color: "#7B3FE4", icon: "camera", enabled: true },
  { id: "4", title: "Watch my travel vlogs", url: "youtube.com/@novaonthemove", color: "#EF4444", icon: "youtube", enabled: true },
];

const AI_BIO =
  "Chasing sunsets & street food across 40+ countries. Content creator, travel guide author, and certified coffee snob. She/her.";

const MAX_BIO = 160;

export default function EditBioScreen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("Nova Reyes");
  const [bio, setBio] = useState(AI_BIO);
  const [bioFocused, setBioFocused] = useState(false);
  const [links, setLinks] = useState<Link[]>(DEFAULT_LINKS);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function moveUp(idx: number) {
    if (idx === 0) return;
    const next = [...links];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    setLinks(next);
  }

  function moveDown(idx: number) {
    if (idx === links.length - 1) return;
    const next = [...links];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    setLinks(next);
  }

  function updateUrl(id: string, url: string) {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, url } : l)));
  }

  function toggleEnabled(id: string) {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l)));
  }

  const tryAgainBios = [
    "Wanderlust-driven creator turning adventures into content. 40+ countries, one lens at a time. Travel tips, reels & real talk.",
    "Perpetual traveler, storyteller, and street food enthusiast. Helping you explore the world one post at a time. She/her.",
    "Creating the travel content I wish existed. 40+ countries, 0 regrets. Guides, vlogs & the occasional coffee obsession.",
  ];
  const [tryIdx, setTryIdx] = useState(0);

  const handleTryAgain = () => {
    const next = (tryIdx + 1) % tryAgainBios.length;
    setTryIdx(next);
    setBio(tryAgainBios[next]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) }]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
            <Feather name="chevron-left" size={22} color="#7B3FE4" />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Add profile details</Text>
            <Text style={styles.headerSub}>Add your profile image, name, and bio.</Text>
          </View>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <Image
                source={require("../assets/images/nova-avatar.png")}
                style={styles.avatar}
                contentFit="cover"
              />
              <Pressable style={styles.avatarAddBtn}>
                <Feather name="plus" size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>

          {/* AI tag */}
          <View style={styles.aiTag}>
            <Feather name="zap" size={12} color="#7B3FE4" />
            <Text style={styles.aiTagText}>AI generated your profile details from your social data</Text>
          </View>

          {/* Display Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Display Name</Text>
            <TextInput
              style={styles.fieldInput}
              value={name}
              onChangeText={setName}
              placeholder="Your display name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Bio */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Bio</Text>
            <View style={[styles.bioWrapper, bioFocused && styles.bioWrapperFocused]}>
              <TextInput
                style={styles.bioInput}
                value={bio}
                onChangeText={(t) => setBio(t.slice(0, MAX_BIO))}
                onFocus={() => setBioFocused(true)}
                onBlur={() => setBioFocused(false)}
                placeholder="Tell the world what you're about"
                placeholderTextColor="#9CA3AF"
                multiline
                maxLength={MAX_BIO}
              />
              <Text style={styles.charCount}>
                {bio.length}/{MAX_BIO}
              </Text>
            </View>
          </View>

          {/* Try Again */}
          <View style={styles.tryAgainSection}>
            <Text style={styles.tryAgainHint}>
              Need inspiration? Let AI regenerate your bio.
            </Text>
            <Pressable
              style={({ pressed }) => [styles.tryAgainBtn, pressed && { opacity: 0.85 }]}
              onPress={handleTryAgain}
            >
              <Feather name="refresh-cw" size={15} color="#7B3FE4" />
              <Text style={styles.tryAgainText}>Try again</Text>
            </Pressable>
          </View>

          {/* Links section */}
          <View style={styles.linksSection}>
            <View style={styles.linksSectionHeader}>
              <View style={styles.linksSectionLeft}>
                <Text style={styles.sectionLabel}>YOUR LINKS</Text>
                <View style={styles.aiChip}>
                  <Feather name="zap" size={10} color="#7B3FE4" />
                  <Text style={styles.aiChipText}>AI-generated</Text>
                </View>
              </View>
              <Text style={styles.linksSectionHint}>Tap to edit URL</Text>
            </View>

            {links.map((link, idx) => {
              const isExpanded = expandedId === link.id;
              return (
                <View
                  key={link.id}
                  style={[styles.linkRow, !link.enabled && styles.linkRowDisabled]}
                >
                  {/* Reorder column */}
                  <View style={styles.reorderCol}>
                    <Pressable
                      onPress={() => moveUp(idx)}
                      hitSlop={6}
                      style={[styles.reorderBtn, idx === 0 && styles.reorderBtnDisabled]}
                    >
                      <Feather name="chevron-up" size={14} color={idx === 0 ? "#D1D5DB" : "#6B7280"} />
                    </Pressable>
                    <Feather name="menu" size={14} color="#D1D5DB" />
                    <Pressable
                      onPress={() => moveDown(idx)}
                      hitSlop={6}
                      style={[styles.reorderBtn, idx === links.length - 1 && styles.reorderBtnDisabled]}
                    >
                      <Feather name="chevron-down" size={14} color={idx === links.length - 1 ? "#D1D5DB" : "#6B7280"} />
                    </Pressable>
                  </View>

                  {/* Icon dot */}
                  <View style={[styles.linkIconDot, { backgroundColor: link.color }]}>
                    <Feather name={link.icon as any} size={12} color="#FFFFFF" />
                  </View>

                  {/* Title + URL */}
                  <Pressable
                    style={styles.linkBody}
                    onPress={() => setExpandedId(isExpanded ? null : link.id)}
                  >
                    <Text style={[styles.linkTitle, !link.enabled && styles.linkTitleDisabled]} numberOfLines={1}>
                      {link.title}
                    </Text>
                    {isExpanded ? (
                      <TextInput
                        style={styles.linkUrlInput}
                        value={link.url}
                        onChangeText={(t) => updateUrl(link.id, t)}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="url"
                        placeholder="https://"
                        placeholderTextColor="#9CA3AF"
                        onSubmitEditing={() => setExpandedId(null)}
                      />
                    ) : (
                      <Text style={styles.linkUrl} numberOfLines={1}>{link.url}</Text>
                    )}
                  </Pressable>

                  {/* Toggle */}
                  <Switch
                    value={link.enabled}
                    onValueChange={() => toggleEnabled(link.id)}
                    trackColor={{ false: "#E5E7EB", true: "#C5E84F" }}
                    thumbColor={link.enabled ? "#1D3C34" : "#9CA3AF"}
                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                  />
                </View>
              );
            })}
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16) }]}>
          <Pressable
            style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.85 }]}
            onPress={() => router.back()}
          >
            <Text style={styles.saveBtnText}>Save profile details</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Inter_700Bold",
  },
  headerSub: {
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  skipText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontFamily: "Inter_500Medium",
    width: 36,
    textAlign: "right",
  },
  content: { paddingHorizontal: 20, paddingTop: 16 },
  avatarSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatarWrapper: {
    position: "relative",
    width: 96,
    height: 96,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarAddBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  aiTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0E8FF",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
  },
  aiTagText: {
    flex: 1,
    fontSize: 12,
    color: "#7B3FE4",
    fontFamily: "Inter_500Medium",
    lineHeight: 17,
  },
  fieldGroup: { marginBottom: 16 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    fontFamily: "Inter_600SemiBold",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fieldInput: {
    backgroundColor: "#F8F7F5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1A1A1A",
    fontFamily: "Inter_500Medium",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  bioWrapper: {
    backgroundColor: "#F8F7F5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  bioWrapperFocused: {
    borderColor: "#7B3FE4",
    backgroundColor: "#FFFFFF",
  },
  bioInput: {
    fontSize: 15,
    color: "#1A1A1A",
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    minHeight: 80,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: "Inter_400Regular",
    textAlign: "right",
    marginTop: 6,
  },
  tryAgainSection: {
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  tryAgainHint: {
    fontSize: 13,
    color: "#9CA3AF",
    fontFamily: "Inter_400Regular",
  },
  tryAgainBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1.5,
    borderColor: "#7B3FE4",
    backgroundColor: "#F0E8FF",
  },
  tryAgainText: {
    fontSize: 15,
    color: "#7B3FE4",
    fontFamily: "Inter_600SemiBold",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  saveBtn: {
    backgroundColor: "#1D3C34",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
  },

  linksSection: {
    marginTop: 28,
  },
  linksSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  linksSectionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  aiChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#F0E8FF",
    borderRadius: 50,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  aiChipText: {
    fontSize: 10,
    color: "#7B3FE4",
    fontFamily: "Inter_600SemiBold",
  },
  linksSectionHint: {
    fontSize: 11,
    color: "#9CA3AF",
    fontFamily: "Inter_400Regular",
  },

  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FAFAFA",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  linkRowDisabled: {
    opacity: 0.45,
  },

  reorderCol: {
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
    width: 20,
  },
  reorderBtn: {
    padding: 2,
  },
  reorderBtnDisabled: {
    opacity: 0.3,
  },

  linkIconDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  linkBody: {
    flex: 1,
    gap: 3,
  },
  linkTitle: {
    fontSize: 13,
    color: "#1A1A1A",
    fontFamily: "Inter_600SemiBold",
  },
  linkTitleDisabled: {
    color: "#9CA3AF",
  },
  linkUrl: {
    fontSize: 11,
    color: "#9CA3AF",
    fontFamily: "Inter_400Regular",
  },
  linkUrlInput: {
    fontSize: 12,
    color: "#1A1A1A",
    fontFamily: "Inter_400Regular",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1.5,
    borderColor: "#7B3FE4",
    marginTop: 2,
  },
});
