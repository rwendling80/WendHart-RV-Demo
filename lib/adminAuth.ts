import { createHash } from "crypto";

export const ADMIN_SESSION_COOKIE = "wendhart_admin_session";

// Stateless "session": the cookie is just a hash of the admin password plus
// a fixed salt. Anyone who knows the password can compute it, but the
// password itself is never stored client-side, and the cookie can't be
// reverse-engineered back into the password.
function expectedSessionValue(): string {
  const password = process.env.ADMIN_PASSWORD ?? "";
  return createHash("sha256").update(`wendhart-admin-salt:${password}`).digest("hex");
}

export function checkAdminPassword(password: string): boolean {
  return password.length > 0 && password === process.env.ADMIN_PASSWORD;
}

export function adminSessionCookieValue(): string {
  return expectedSessionValue();
}

export function isValidAdminSessionValue(value: string | undefined): boolean {
  if (!value) return false;
  return value === expectedSessionValue();
}
