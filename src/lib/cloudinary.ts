import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default cloudinary;

export type CloudinaryResourceType = "image" | "video" | "raw";

export function getResourceTypeFromMime(mimeType: string): CloudinaryResourceType {
  if (mimeType?.startsWith("image/")) return "image";
  if (mimeType?.startsWith("video/")) return "video";
  return "raw";
}

/**
 * Parse Cloudinary secure_url to extract resource_type and public_id including folder.
 * Supports standard URLs: /<cloud_name>/<resource_type>/upload/v<version>/<folder>/<public_id>.<ext>
 */
export function parseCloudinaryUrl(url: string): {
  publicId: string | null;
  resourceType: CloudinaryResourceType | null;
} {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    const uploadIdx = parts.indexOf("upload");
    if (uploadIdx < 0) return { publicId: null, resourceType: null };

    // resource_type is typically just before "upload"
    const resourceTypePart = parts[uploadIdx - 1];
    const resourceType =
      resourceTypePart === "image" || resourceTypePart === "video" || resourceTypePart === "raw"
        ? (resourceTypePart as CloudinaryResourceType)
        : null;

    // segments after "upload" can include version "v123456"
    const afterUpload = parts.slice(uploadIdx + 1);
    if (afterUpload[0]?.startsWith("v")) afterUpload.shift();

    const filePathWithExt = afterUpload.join("/"); // e.g. siswa-berkas/abc123.jpg
    if (!filePathWithExt) return { publicId: null, resourceType };

    const publicId = filePathWithExt.replace(/\.[^/.]+$/, ""); // remove extension
    return { publicId, resourceType };
  } catch {
    return { publicId: null, resourceType: null };
  }
}

/**
 * Safely destroy an asset by its secure_url.
 */
export async function destroyByUrl(url: string): Promise<boolean> {
  const { publicId, resourceType } = parseCloudinaryUrl(url);
  if (!publicId || !resourceType) return false;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return true;
  } catch {
    return false;
  }
}
