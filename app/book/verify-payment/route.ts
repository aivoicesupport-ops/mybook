import crypto from "crypto";
import { adminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      uid,
      bookId,
    } = body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !uid ||
      !bookId
    ) {
      return Response.json(
        {
          success: false,
          error: "Missing payment details",
        },
        { status: 400 }
      );
    }

    // Razorpay signature verify
    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET!
      )
      .update(
        razorpay_order_id + "|" + razorpay_payment_id
      )
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return Response.json(
        {
          success: false,
          error: "Invalid payment signature",
        },
        { status: 400 }
      );
    }

    // Prevent duplicate payment processing
    const paymentRef = adminDb
      .collection("bookPayments")
      .doc(razorpay_payment_id);

    const paymentDoc = await paymentRef.get();

    if (paymentDoc.exists) {
      return Response.json({
        success: true,
        duplicate: true,
      });
    }

    // Save successful book purchase
    await paymentRef.set({
      uid,
      bookId,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount: 49,
      currency: "INR",
      createdAt: Timestamp.now(),
    });

    // Give user access to the book
    const userRef = adminDb
      .collection("users")
      .doc(uid);

    await userRef.set(
      {
        purchasedBooks: {
          [bookId]: true,
        },
      },
      {
        merge: true,
      }
    );

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error("Book payment verification error:", error);

    return Response.json(
      {
        success: false,
        error: "Payment verification failed",
      },
      { status: 500 }
    );
  }
}