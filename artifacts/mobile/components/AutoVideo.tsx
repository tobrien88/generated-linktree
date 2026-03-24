import { useVideoPlayer, VideoView } from "expo-video";

interface Props {
  source: ReturnType<typeof require>;
  videoPath: string;
  posterPath?: string;
  style: object;
}

export default function AutoVideo({ source, style }: Props) {
  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  return (
    <VideoView
      player={player}
      style={style}
      contentFit="cover"
      nativeControls={false}
    />
  );
}
