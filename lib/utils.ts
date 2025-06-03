import { clsx, type ClassValue } from "clsx";
import * as Crypto from "expo-crypto";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function generateCodeVerifier(): string {
  let randomString = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  for (let i = 0; i < 128; i++) {
    randomString += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return randomString;
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const hashed = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, codeVerifier);
  return hashed.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export const generatePkcePair = async (): Promise<{ codeVerifier: string; codeChallenge: string }> => {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  return {
    codeVerifier,
    codeChallenge,
  };
};
