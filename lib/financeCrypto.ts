import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

// AES-256-GCM, application-level encryption for SSN/DOB. The key never
// touches the database — it only lives in FINANCING_ENCRYPTION_KEY (env
// var, set separately in Vercel). Stored format: "iv:authTag:ciphertext",
// each base64, so a single text column holds everything needed to decrypt.
function getKey(): Buffer {
  const raw = process.env.FINANCING_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error("FINANCING_ENCRYPTION_KEY is not set");
  }
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) {
    throw new Error("FINANCING_ENCRYPTION_KEY must decode to 32 bytes");
  }
  return key;
}

export function encrypt(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return [iv, authTag, ciphertext].map((b) => b.toString("base64")).join(":");
}

export function decrypt(stored: string): string {
  const [ivB64, authTagB64, ciphertextB64] = stored.split(":");
  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(authTagB64, "base64");
  const ciphertext = Buffer.from(ciphertextB64, "base64");

  const decipher = createDecipheriv("aes-256-gcm", getKey(), iv);
  decipher.setAuthTag(authTag);
  const plaintext = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);
  return plaintext.toString("utf8");
}
