"use client";

import { FormEvent, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
      } else {
        const userCredential =
          await createUserWithEmailAndPassword(
            auth,
            email.trim(),
            password
          );

        const user = userCredential.user;

        // Firestore में user profile/document बनाएं
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          credits: 0,
          createdAt: new Date(),
        });
      }

      router.push("/book");
    } catch (error: any) {
      console.error(error);

      switch (error?.code) {
        case "auth/invalid-email":
          setError("कृपया सही email address डालें।");
          break;

        case "auth/user-not-found":
          setError("इस email से कोई account नहीं मिला।");
          break;

        case "auth/wrong-password":
        case "auth/invalid-credential":
          setError("Email या password गलत है।");
          break;

        case "auth/email-already-in-use":
          setError("इस email से account पहले से मौजूद है।");
          break;

        case "auth/weak-password":
          setError(
            "Password कम से कम 6 characters का होना चाहिए।"
          );
          break;

        case "permission-denied":
          setError(
            "Account बन गया है, लेकिन profile save नहीं हो पाई।"
          );
          break;

        default:
          setError(
            isLogin
              ? "Login नहीं हो पाया। कृपया दोबारा कोशिश करें।"
              : "Account नहीं बन पाया। कृपया दोबारा कोशिश करें।"
          );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-16 text-white">
      <div className="mx-auto max-w-md">

        <div className="mb-8 text-center">
          <p className="text-sm text-zinc-500">
            MY HINDI BOOK
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            {isLogin ? "Welcome Back" : "Account बनाएँ"}
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            {isLogin
              ? "अपनी किताबें पढ़ने और purchases access करने के लिए login करें।"
              : "REBOOT और आपकी खरीदी गई किताबों का access सुरक्षित रखने के लिए account बनाएँ।"}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm text-zinc-300"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-zinc-400"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm text-zinc-300"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete={
                  isLogin
                    ? "current-password"
                    : "new-password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="कम से कम 6 characters"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-zinc-400"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Login करें"
                : "Account बनाएँ"}
            </button>

          </form>

          <div className="mt-6 border-t border-zinc-800 pt-6 text-center">
            <p className="text-sm text-zinc-500">
              {isLogin
                ? "पहली बार आए हैं?"
                : "पहले से account है?"}
            </p>

            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="mt-2 text-sm font-semibold text-white underline underline-offset-4"
            >
              {isLogin
                ? "नया account बनाएँ"
                : "Login करें"}
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}