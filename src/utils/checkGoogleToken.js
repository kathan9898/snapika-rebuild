// src/utils/checkGoogleToken.js
export async function isGoogleTokenValid(token) {
  if (!token) return false;
  try {
    const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${token}`);
    if (!res.ok) return false;
    const data = await res.json();
    // You could also check data.aud === your client_id if you want
    return !data.error;
  } catch {
    return false;
  }
}
