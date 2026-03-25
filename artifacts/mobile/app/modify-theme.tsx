import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SE_ASIA_SRC = require("../assets/images/se-asia-bg.png");
const NOVA_AVATAR = require("../assets/images/nova-avatar.png");

const TEMPLATES = [
  {
    id: "midnight",
    name: "Midnight",
    colors: ["#0D0D0D", "#1A1A2E"] as [string, string],
    buttonColor: "rgba(255,255,255,0.12)",
    textColor: "#FFFFFF",
  },
  {
    id: "sunset-blush",
    name: "Sunset Blush",
    colors: ["#F7C5B0", "#F0A090"] as [string, string],
    buttonColor: "rgba(255,255,255,0.4)",
    textColor: "#6B3020",
  },
  {
    id: "forest-deep",
    name: "Forest Deep",
    colors: ["#1B4332", "#2D6A4F"] as [string, string],
    buttonColor: "rgba(197,232,79,0.3)",
    textColor: "#FFFFFF",
  },
  {
    id: "minimal-gray",
    name: "Minimal Gray",
    colors: ["#F5F5F5", "#EBEBEB"] as [string, string],
    buttonColor: "rgba(0,0,0,0.08)",
    textColor: "#1A1A1A",
  },
  {
    id: "cocoa-stripe",
    name: "Cocoa Stripe",
    colors: ["#5C4033", "#7A5C4A"] as [string, string],
    buttonColor: "rgba(255,255,255,0.15)",
    textColor: "#F5EBE0",
  },
  {
    id: "berry-night",
    name: "Berry Night",
    colors: ["#3B1F3A", "#5A2D5A"] as [string, string],
    buttonColor: "rgba(255,255,255,0.15)",
    textColor: "#FFFFFF",
  },
  {
    id: "lime-fresh",
    name: "Lime Fresh",
    colors: ["#C5E84F", "#A8CC2A"] as [string, string],
    buttonColor: "rgba(29,60,52,0.2)",
    textColor: "#1D3C34",
  },
  {
    id: "terracotta",
    name: "Terracotta",
    colors: ["#C9614A", "#E8A87C"] as [string, string],
    buttonColor: "rgba(255,255,255,0.3)",
    textColor: "#FFFFFF",
  },
];

function TemplateCard({
  tmpl,
  isSelected,
  onPress,
}: {
  tmpl: (typeof TEMPLATES)[0];
  isSelected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.templateCard, isSelected && styles.templateCardSelected]}
      onPress={onPress}
    >
      <LinearGradient colors={tmpl.colors} style={styles.templateGradient}>
        <View style={[styles.tAvatar, { borderColor: tmpl.textColor === "#FFFFFF" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.2)" }]} />
        <View style={[styles.tBar, { backgroundColor: tmpl.buttonColor }]} />
        <View style={[styles.tBar, { backgroundColor: tmpl.buttonColor }]} />
        <View style={[styles.tBar, { backgroundColor: tmpl.buttonColor }]} />
      </LinearGradient>
      <Text style={[styles.templateName, isSelected && { color: "#7B3FE4" }]} numberOfLines={1}>
        {tmpl.name}
      </Text>
      {isSelected && (
        <View style={styles.selectedDot}>
          <Feather name="check" size={11} color="#FFFFFF" />
        </View>
      )}
    </Pressable>
  );
}

export default function ModifyThemeScreen() {
  const insets = useSafeAreaInsets();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customPhotoUri, setCustomPhotoUri] = useState<string | null>(null);

  const isCustom = selectedTemplate === null;
  const activeTemplate = TEMPLATES.find((t) => t.id === selectedTemplate);

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.9,
    });
    if (!result.canceled && result.assets[0]) {
      setCustomPhotoUri(result.assets[0].uri);
      setSelectedTemplate(null);
    }
  }

  const previewSrc = customPhotoUri ? { uri: customPhotoUri } : SE_ASIA_SRC;

  return (
    <View style={[
      styles.container,
      {
        paddingTop: insets.top + (Platform.OS === "web" ? 44 : 0),
        ...(Platform.OS === "web" ? { height: "100vh" as unknown as number } : {}),
      },
    ]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Feather name="chevron-left" size={22} color="#7B3FE4" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Edit theme</Text>
          <Text style={styles.headerSub}>Customize your Linktree look</Text>
        </View>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Live preview card */}
        <View style={styles.previewCard}>
          {isCustom ? (
            <ImageBackground
              source={previewSrc}
              style={styles.previewBg}
              imageStyle={styles.previewBgImage}
            >
              <LinearGradient
                colors={["rgba(0,0,0,0.04)", "rgba(10,38,26,0.5)", "rgba(6,28,18,0.92)"]}
                style={styles.previewGradient}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
              >
                <View style={styles.previewAvatarRing}>
                  <Image source={NOVA_AVATAR} style={styles.previewAvatar} contentFit="cover" />
                </View>
                <Text style={styles.previewHandle}>@novaonthemove</Text>
                {["Free SE Asia Travel Guide", "Follow me on TikTok", "My Lightroom Preset Pack"].map((l) => (
                  <View key={l} style={styles.previewLink}>
                    <Text style={styles.previewLinkText} numberOfLines={1}>{l}</Text>
                  </View>
                ))}
                <View style={styles.aiChip}>
                  <Feather name="zap" size={10} color="#7B3FE4" />
                  <Text style={styles.aiChipText}>AI-recommended</Text>
                </View>
              </LinearGradient>
            </ImageBackground>
          ) : (
            <LinearGradient colors={activeTemplate!.colors} style={styles.previewGradientFull}>
              <View style={[styles.previewAvatarRing, { borderColor: "rgba(255,255,255,0.5)" }]}>
                <Image source={NOVA_AVATAR} style={styles.previewAvatar} contentFit="cover" />
              </View>
              <Text style={[styles.previewHandle, { color: activeTemplate!.textColor }]}>@novaonthemove</Text>
              {["Free SE Asia Travel Guide", "Follow me on TikTok", "My Lightroom Preset Pack"].map((l) => (
                <View key={l} style={[styles.previewLink, { backgroundColor: activeTemplate!.buttonColor }]}>
                  <Text style={[styles.previewLinkText, { color: activeTemplate!.textColor }]} numberOfLines={1}>{l}</Text>
                </View>
              ))}
            </LinearGradient>
          )}
        </View>

        {/* Upload your own photo */}
        <Text style={styles.sectionLabel}>BACKGROUND PHOTO</Text>
        <Pressable
          style={({ pressed }) => [styles.uploadBtn, pressed && { opacity: 0.8 }]}
          onPress={pickImage}
        >
          <View style={styles.uploadIcon}>
            <Feather name="image" size={20} color="#7B3FE4" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.uploadTitle}>
              {customPhotoUri ? "Change photo" : "Upload your own photo"}
            </Text>
            <Text style={styles.uploadSub}>
              {customPhotoUri ? "Tap to pick a different image" : "Use any image as your background"}
            </Text>
          </View>
          <Feather name="chevron-right" size={18} color="#9CA3AF" />
        </Pressable>

        {/* Template grid */}
        <Text style={styles.sectionLabel}>TEMPLATES</Text>
        <View style={styles.grid}>
          {TEMPLATES.map((tmpl) => (
            <TemplateCard
              key={tmpl.id}
              tmpl={tmpl}
              isSelected={selectedTemplate === tmpl.id}
              onPress={() => setSelectedTemplate(tmpl.id)}
            />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16) }]}>
        <Pressable
          style={({ pressed }) => [styles.applyBtn, pressed && { opacity: 0.85 }]}
          onPress={() => router.back()}
        >
          <Text style={styles.applyBtnText}>
            {isCustom ? "Keep this theme" : `Apply "${activeTemplate!.name}"`}
          </Text>
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

  scrollContent: { paddingHorizontal: 16 },

  previewCard: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#0A2A1A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  previewBg: { width: "100%" },
  previewBgImage: { borderRadius: 20 },
  previewGradient: {
    padding: 20,
    alignItems: "center",
    gap: 7,
    minHeight: 260,
  },
  previewGradientFull: {
    padding: 20,
    alignItems: "center",
    gap: 7,
    minHeight: 260,
    borderRadius: 20,
  },
  previewAvatarRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
    overflow: "hidden",
    marginBottom: 4,
  },
  previewAvatar: { width: 60, height: 60 },
  previewHandle: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "Quicksand_700Bold",
    letterSpacing: 0.3,
  },
  previewLink: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.88)",
    borderRadius: 50,
    paddingVertical: 9,
    paddingHorizontal: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  previewLinkText: {
    fontSize: 12,
    color: "#1A1A1A",
    fontFamily: "Inter_600SemiBold",
  },
  aiChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F0E8FF",
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 4,
  },
  aiChipText: {
    fontSize: 11,
    color: "#7B3FE4",
    fontFamily: "Inter_600SemiBold",
  },

  sectionLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 4,
  },

  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#F8F7FF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#E0D4FF",
    marginBottom: 20,
  },
  uploadIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EDE4FF",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadTitle: {
    fontSize: 15,
    color: "#1A1A1A",
    fontFamily: "Inter_600SemiBold",
    marginBottom: 2,
  },
  uploadSub: {
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: "Inter_400Regular",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 8,
  },
  templateCard: {
    width: "47%",
    borderRadius: 14,
    overflow: "visible",
    borderWidth: 2.5,
    borderColor: "transparent",
    position: "relative",
  },
  templateCardSelected: {
    borderColor: "#7B3FE4",
  },
  templateGradient: {
    borderRadius: 12,
    padding: 12,
    gap: 6,
    height: 110,
    alignItems: "center",
  },
  tAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderWidth: 1.5,
    marginBottom: 4,
  },
  tBar: {
    width: "100%",
    height: 14,
    borderRadius: 7,
  },
  templateName: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: "Inter_500Medium",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 2,
  },
  selectedDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
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
