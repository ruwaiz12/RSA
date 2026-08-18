/**
 * Browser-compatible SHA-256 with salt using the Web Crypto API
 */
export async function hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
  const currentSalt = salt || window.crypto.getRandomValues(new Uint8Array(16)).reduce((acc, val) => acc + val.toString(16).padStart(2, '0'), '');
  const enc = new TextEncoder();
  const data = enc.encode(password + currentSalt);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return { hash, salt: currentSalt };
}

export async function verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
  const computed = await hashPassword(password, salt);
  return computed.hash === hash;
}