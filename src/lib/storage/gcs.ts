import { Storage } from "@google-cloud/storage";

const storage = new Storage({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "taxable-ai-2026" });
const BUCKET = process.env.GCS_BUCKET ?? "taxable-ai-documents";

export async function uploadFile(
  path: string,
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  const file = storage.bucket(BUCKET).file(path);
  await file.save(buffer, { contentType: mimeType, resumable: false });
  return `https://storage.googleapis.com/${BUCKET}/${path}`;
}

export async function deleteFile(path: string): Promise<void> {
  await storage.bucket(BUCKET).file(path).delete({ ignoreNotFound: true });
}

export async function getSignedUrl(path: string, expiresInMs = 3600000): Promise<string> {
  const [url] = await storage.bucket(BUCKET).file(path).getSignedUrl({
    action: "read",
    expires: Date.now() + expiresInMs,
  });
  return url;
}
