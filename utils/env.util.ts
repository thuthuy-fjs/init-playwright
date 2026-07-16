export function requiredEnv(name: string, defaultValue?: string): string {
  const value = process.env[name] ?? defaultValue;
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. See .env.example`,
    );
  }
  return value;
}
