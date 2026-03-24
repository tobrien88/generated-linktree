import { StyleSheet, View } from "react-native";
import { Video, ResizeMode } from "expo-av";

interface Props {
  source: ReturnType<typeof require>;
  videoPath: string;
  posterPath?: string;
  style: object;
}

export default function AutoVideo({ source, style }: Props) {
  return (
    <View style={[style, { overflow: "hidden" }]}>
      <Video
        source={source}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
        useNativeControls={false}
      />
    </View>
  );
}
