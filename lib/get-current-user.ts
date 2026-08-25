import { adminAuth } from "@/lib/firebase-admin";

export async function getCurrentUser(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return null;
    }

    const idToken = authHeader.substring(7);

    const decodedToken =
      await adminAuth.verifyIdToken(idToken);

    return decodedToken;
  } catch (error) {
    console.error("Firebase token verification error:", error);
    return null;
  }
}