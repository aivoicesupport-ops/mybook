"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function UnlockBookButton({
  bookId,
  amount,
}: {
  bookId: string;
  amount: number;
}) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const user = auth.currentUser;

      if (!user) {
        alert("कृपया पहले Login करें।");
        setLoading(false);
        return;
      }

      // Load Razorpay Checkout
      if (!window.Razorpay) {
        const script = document.createElement("script");

        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;

        document.body.appendChild(script);

        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () =>
            reject(new Error("Razorpay load failed"));
        });
      }

      // Create Razorpay order
      const orderResponse = await fetch("/api/book/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId,
          amount,
        }),
      });

      const order = await orderResponse.json();

      if (!orderResponse.ok || !order.id) {
        throw new Error("Order create नहीं हुआ।");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

        amount: order.amount,
        currency: order.currency,
        name: "MyHindiBook",
        description: "REBOOT — Complete Book",

        order_id: order.id,

        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch(
              "/api/book/verify-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,

                  uid: user.uid,

                  bookId,
                }),
              }
            );

            const result = await verifyResponse.json();

            if (result.success) {
              alert(
                "Payment successful! पूरी किताब unlock हो गई है।"
              );

              window.location.href = "/book";
            } else {
              alert(
                "Payment हुआ, लेकिन verification failed हुआ।"
              );
            }
          } catch (error) {
            console.error(error);

            alert(
              "Payment verification में समस्या हुई।"
            );
          }
        },

        prefill: {
          email: user.email || "",
        },

        theme: {
          color: "#ec4899",
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();

      setLoading(false);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Payment शुरू नहीं हो पाया।"
      );

      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="mt-5 w-full rounded-xl bg-pink-500 px-4 py-3 font-semibold text-white transition hover:bg-pink-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading
        ? "Payment तैयार हो रहा है..."
        : `🔒 ₹${amount} में पूरी किताब Unlock करें`}
    </button>
  );
}