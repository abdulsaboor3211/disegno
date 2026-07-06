/**
 * Google Drive "share" links open a preview page in the browser.
 * Next.js Image needs a direct image URL — convert Drive links to lh3.googleusercontent.com.
 */
export function normalizeImageUrl(url) {
  if (!url || typeof url !== "string") {
    return url;
  }

  const trimmed = url.trim();

  if (!trimmed.includes("drive.google.com")) {
    return trimmed;
  }

  const fileIdMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch) {
    return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}=w1000`;
  }

  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch) {
    return `https://lh3.googleusercontent.com/d/${idParamMatch[1]}=w1000`;
  }

  return trimmed;
}
