export async function sha256(value: string): Promise<string> {
  if (typeof crypto === 'undefined' || !crypto.subtle) throw new Error('no-subtle');
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
