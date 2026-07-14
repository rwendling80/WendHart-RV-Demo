import { createHash } from "crypto";

export const ADMIN_SESSION_COOKIE = "wendhart_admin_session";

// Stateless "session": the cookie is a hash of the dealer's id + their admin
// password. Including dealer_id in the salt means a session cookie minted
// for one dealer can never validate against a different dealer, even if two
// dealers happen to pick the same password.
function expectedSessionValue(dealerId: string, adminPassword: string): string {
  return createHash("sha256")
    .update(`wendhart-admin-salt:${dealerId}:${adminPassword}`)
    .digest("hex");
}

export function checkAdminPassword(adminPassword: string, attempt: string): boolean {
  return attempt.length > 0 && attempt === adminPassword;
}

export function adminSessionCookieValue(dealerId: string, adminPassword: string): string {
  return expectedSessionValue(dealerId, adminPassword);
}

export function isValidAdminSessionValue(
  dealerId: string,
  adminPassword: string,
  value: string | undefined
): boolean {
  if (!value) return false;
  return value === expectedSessionValue(dealerId, adminPassword);
}
