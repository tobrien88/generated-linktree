import { Feather, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";

type Props = {
  platformId: string;
  size?: number;
  color?: string;
};

export function PlatformIcon({ platformId, size = 22, color = "#FFFFFF" }: Props) {
  switch (platformId) {
    case "instagram":
      return <MaterialCommunityIcons name="instagram" size={size} color={color} />;
    case "tiktok":
      return <MaterialCommunityIcons name="music-note" size={size} color={color} />;
    case "threads":
      return <MaterialCommunityIcons name="at" size={size} color={color} />;
    case "youtube":
      return <FontAwesome5 name="youtube" size={size} color={color} />;
    case "spotify":
      return <FontAwesome5 name="spotify" size={size} color={color} />;
    case "twitter":
      return <FontAwesome5 name="twitter" size={size} color={color} />;
    case "facebook":
      return <FontAwesome5 name="facebook" size={size} color={color} />;
    case "pinterest":
      return <FontAwesome5 name="pinterest" size={size} color={color} />;
    case "snapchat":
      return <FontAwesome5 name="snapchat" size={size} color={color} />;
    case "linkedin":
      return <FontAwesome5 name="linkedin" size={size} color={color} />;
    case "soundcloud":
      return <FontAwesome5 name="soundcloud" size={size} color={color} />;
    case "website":
    default:
      return <Feather name="globe" size={size} color={color} />;
  }
}

export const PLATFORM_COLORS: Record<string, string> = {
  instagram: "#E1306C",
  tiktok: "#000000",
  youtube: "#FF0000",
  spotify: "#1DB954",
  website: "#7B3FE4",
  twitter: "#1DA1F2",
  facebook: "#1877F2",
  threads: "#000000",
  pinterest: "#E60023",
  snapchat: "#FFFC00",
  linkedin: "#0077B5",
  soundcloud: "#FF5500",
};
