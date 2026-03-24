const BASE_URL: string = process.env.EXPO_PUBLIC_BASE_URL ?? "";

export function assetPath(path: string): string {
  return `${BASE_URL}${path}`;
}
