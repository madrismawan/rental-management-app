const config = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api",
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Rental Management App",
} as const;

export default config;
