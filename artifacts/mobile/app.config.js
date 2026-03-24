const baseUrl = process.env.EXPO_PUBLIC_BASE_URL ?? "";

module.exports = {
  expo: {
    name: "Linktree AI Onboarding",
    slug: "mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "mobile",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#C5E84F",
    },
    ios: { supportsTablet: false },
    android: {},
    web: {
      favicon: "./assets/images/icon.png",
      output: "static",
    },
    plugins: [
      [
        "expo-router",
        {
          origin: baseUrl
            ? `https://tobrien88.github.io${baseUrl}/`
            : "https://replit.com/",
        },
      ],
      "expo-font",
      "expo-web-browser",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
      baseUrl: baseUrl || undefined,
    },
  },
};
