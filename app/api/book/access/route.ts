import { getCurrentUser } from "@/lib/get-current-user";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    // Firebase ID token verify karke user nikalo
    const user = await getCurrentUser(req);

    if (!user) {
      return Response.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { bookId } = body;

    if (!bookId) {
      return Response.json(
        {
          success: false,
          error: "Book ID required",
        },
        { status: 400 }
      );
    }

    // Server verified UID use karega
    const userRef = adminDb
      .collection("users")
      .doc(user.uid);

    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return Response.json({
        success: true,
        purchased: false,
      });
    }

    const userData = userDoc.data();

    const purchased =
      userData?.purchasedBooks?.[bookId] === true;

    return Response.json({
      success: true,
      purchased,
    });
  } catch (error) {
    console.error("Book access check error:", error);

    return Response.json(
      {
        success: false,
        error: "Access check failed",
      },
      { status: 500 }
    );
  }
}