import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST() {
  try {
    const amount = 4900; // ₹49 in paise

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `reboot_${Date.now()}`,
      notes: {
        product: "REBOOT — 21 दिनों में अपनी ज़िंदगी का System Reset करें",
        type: "book",
      },
    });

    return Response.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Razorpay order error:", error);

    return Response.json(
      {
        success: false,
        error: "Payment order बनाने में समस्या हुई।",
      },
      { status: 500 }
    );
  }
}