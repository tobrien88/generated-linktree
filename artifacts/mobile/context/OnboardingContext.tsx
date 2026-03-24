import React, { createContext, useContext, useMemo, useState, ReactNode } from "react";

export type Platform = {
  id: string;
  name: string;
  handle: string;
  selected: boolean;
};

export type Tier = "free" | "starter" | "pro" | "premium";

export type OnboardingState = {
  username: string;
  email: string;
  platforms: Platform[];
  selectedTier: Tier;
  step: number;
};

type OnboardingContextValue = OnboardingState & {
  setUsername: (username: string) => void;
  setEmail: (email: string) => void;
  togglePlatform: (id: string) => void;
  setPlatformHandle: (id: string, handle: string) => void;
  setSelectedTier: (tier: Tier) => void;
  setStep: (step: number) => void;
};

const INITIAL_PLATFORMS: Platform[] = [
  { id: "instagram", name: "Instagram", handle: "@novaonthemove", selected: true },
  { id: "tiktok", name: "TikTok", handle: "@novaonthemove", selected: true },
  { id: "youtube", name: "YouTube", handle: "@NovaOnTheMove", selected: true },
  { id: "spotify", name: "Spotify", handle: "Nova Reyes", selected: true },
  { id: "website", name: "Website", handle: "novaonthemove.com", selected: true },
  { id: "twitter", name: "X (Twitter)", handle: "", selected: false },
  { id: "facebook", name: "Facebook", handle: "", selected: false },
  { id: "threads", name: "Threads", handle: "", selected: false },
  { id: "pinterest", name: "Pinterest", handle: "", selected: false },
  { id: "snapchat", name: "Snapchat", handle: "", selected: false },
  { id: "linkedin", name: "LinkedIn", handle: "", selected: false },
  { id: "soundcloud", name: "SoundCloud", handle: "", selected: false },
];

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState("novaonthemove");
  const [email, setEmail] = useState("nova@example.com");
  const [platforms, setPlatforms] = useState<Platform[]>(INITIAL_PLATFORMS);
  const [selectedTier, setSelectedTier] = useState<Tier>("pro");
  const [step, setStep] = useState(0);

  const togglePlatform = (id: string) => {
    setPlatforms((prev) =>
      prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    );
  };

  const setPlatformHandle = (id: string, handle: string) => {
    setPlatforms((prev) =>
      prev.map((p) => (p.id === id ? { ...p, handle } : p))
    );
  };

  const value = useMemo(
    () => ({
      username,
      email,
      platforms,
      selectedTier,
      step,
      setUsername,
      setEmail,
      togglePlatform,
      setPlatformHandle,
      setSelectedTier,
      setStep,
    }),
    [username, email, platforms, selectedTier, step]
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}
