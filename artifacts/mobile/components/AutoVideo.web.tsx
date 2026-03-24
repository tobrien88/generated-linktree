import React from "react";
import { StyleSheet } from "react-native";

interface Props {
  videoPath: string;
  posterPath?: string;
  style: object;
}

export default function AutoVideo({ videoPath, posterPath, style }: Props) {
  const {
    borderTopLeftRadius,
    borderTopRightRadius,
    borderTopRightRadius: _btrr,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    borderRadius,
    overflow: _overflow,
    alignSelf,
    ...videoStyle
  } = StyleSheet.flatten(style) as React.CSSProperties & Record<string, unknown>;

  const containerStyle: React.CSSProperties = {
    borderTopLeftRadius: (borderTopLeftRadius ?? borderRadius ?? 0) as number,
    borderTopRightRadius: (borderTopRightRadius ?? borderRadius ?? 0) as number,
    borderBottomLeftRadius: (borderBottomLeftRadius ?? borderRadius ?? 0) as number,
    borderBottomRightRadius: (borderBottomRightRadius ?? borderRadius ?? 0) as number,
    overflow: "hidden",
    alignSelf: alignSelf as string,
    display: "block",
    flexShrink: 0,
  };

  return React.createElement(
    "div",
    { style: containerStyle },
    React.createElement("video", {
      src: videoPath,
      poster: posterPath,
      autoPlay: true,
      loop: true,
      muted: true,
      playsInline: true,
      style: {
        ...(videoStyle as React.CSSProperties),
        objectFit: "cover",
        display: "block",
        border: "none",
        outline: "none",
      },
    })
  );
}
