import React from "react";
import { StyleSheet } from "react-native";

interface Props {
  videoPath: string;
  posterPath?: string;
  style: object;
}

export default function AutoVideo({ videoPath, posterPath, style }: Props) {
  const flat = StyleSheet.flatten(style) as React.CSSProperties;
  return React.createElement("video", {
    src: videoPath,
    poster: posterPath,
    autoPlay: true,
    loop: true,
    muted: true,
    playsInline: true,
    style: { ...flat, objectFit: "cover", display: "block" },
  });
}
