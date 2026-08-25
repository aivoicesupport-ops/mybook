"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

import UnlockBookButton from "./UnlockBookButton";
import { books } from "@/lib/books";
import { auth, db } from "@/lib/firebase";

export default function BookPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [checkingPurchase, setCheckingPurchase] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [bookPurchased, setBookPurchased] = useState(false);

  const book = books[0];
  const chapters = book.chapters;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/auth");
        return;
      }

      setCheckingAuth(false);

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();

          const purchasedBooks =
            userData.purchasedBooks || {};

          const purchased =
            purchasedBooks[book.id] === true;

          setBookPurchased(purchased);
        } else {
          setBookPurchased(false);
        }
      } catch (error) {
        console.error(
          "Purchase status check error:",
          error
        );

        setBookPurchased(false);
      } finally {
        setCheckingPurchase(false);
      }
    });

    return () => unsubscribe();
  }, [router, book.id]);

  async function handleLogout() {
    try {
      setLoggingOut(true);

      await signOut(auth);

      router.replace("/auth");
    } catch (error) {
      console.error("Logout error:", error);
      setLoggingOut(false);
    }
  }

  // Firebase auth check
  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="text-center">
          <p className="text-sm text-zinc-500">
            MY HINDI BOOK
          </p>

          <p className="mt-3 text-zinc-300">
            Loading...
          </p>
        </div>
      </main>
    );
  }

  // Purchase status check
  if (checkingPurchase) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="text-center">
          <p className="text-sm text-zinc-500">
            MY HINDI BOOK
          </p>

          <p className="mt-3 text-zinc-300">
            Book access check हो रहा है...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">

          <div>
            <p className="text-xs text-zinc-500">
              MY HINDI BOOK
            </p>

            <h1 className="text-lg font-bold">
              {book.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">

            <Link
              href="/"
              className="rounded-lg border border-zinc-700 px-3 py-2 text-sm transition hover:bg-zinc-800"
            >
              Home
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-lg border border-zinc-700 px-3 py-2 text-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loggingOut ? "..." : "Logout"}
            </button>

          </div>
        </div>
      </header>

      {/* Book Introduction */}
      <section className="mx-auto max-w-4xl px-5 py-10">

        <p className="text-sm text-zinc-500">
          {book.chapters.length} Chapters
        </p>

        <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
          {book.title}
        </h2>

        <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
          {book.description}
        </p>

        {/* Purchase Status */}
        {bookPurchased ? (
          <div className="mt-6 rounded-2xl border border-green-900 bg-green-950/30 p-5">

            <p className="text-sm text-green-400">
              ✓ Book Unlocked
            </p>

            <p className="mt-2 text-lg font-semibold">
              आपकी पूरी किताब unlocked है।
            </p>

            <p className="mt-1 text-sm text-zinc-400">
              अब आप सभी chapters पढ़ सकते हैं।
            </p>

          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">

            <p className="text-sm text-zinc-400">
              पूरी किताब का Launch Offer
            </p>

            <div className="mt-2 flex items-center gap-3">

              <span className="text-lg text-zinc-500 line-through">
                ₹99
              </span>

              <span className="text-3xl font-bold text-white">
                ₹{book.textPrice}
              </span>

              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-black">
                अभी सिर्फ ₹{book.textPrice}
              </span>

            </div>

            <p className="mt-2 text-sm text-zinc-400">
              एक बार खरीदें और पूरी किताब के सभी chapters पढ़ें।
            </p>

          </div>
        )}

        {/* Audiobook */}
        {book.audioAvailable && (
          <div className="mt-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">

            <p className="text-sm text-zinc-400">
              Audiobook
            </p>

            <div className="mt-2 flex items-center gap-3">

              <span className="text-2xl font-bold">
                🎧 ₹{book.audioPrice}
              </span>

              <span className="text-sm text-zinc-400">
                पूरी Audiobook
              </span>

            </div>

            <p className="mt-2 text-sm text-zinc-500">
              Chapter-wise audio access।
            </p>

          </div>
        )}

        {/* Reading Controls */}
        <div className="mt-7 flex flex-wrap gap-3">

          <button
            type="button"
            className="rounded-xl border border-zinc-700 px-4 py-2 text-sm"
          >
            A−
          </button>

          <button
            type="button"
            className="rounded-xl border border-zinc-700 px-4 py-2 text-sm"
          >
            A+
          </button>

          <button
            type="button"
            className="rounded-xl border border-zinc-700 px-4 py-2 text-sm"
          >
            ☀️ Light
          </button>

          <button
            type="button"
            className="rounded-xl border border-zinc-700 px-4 py-2 text-sm"
          >
            🎧 Audio
          </button>

        </div>
      </section>

      {/* Chapters */}
      <section className="mx-auto max-w-4xl px-5 pb-16">

        <h3 className="mb-5 text-xl font-bold">
          Chapters
        </h3>

        <div className="space-y-4">

          {chapters.map((chapter) => {

            // Purchased होने पर सभी chapters unlocked
            const isUnlocked =
              bookPurchased || !chapter.locked;

            return (
              <article
                key={chapter.number}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
              >

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <p className="text-sm text-zinc-500">
                      Chapter {chapter.number}
                    </p>

                    <h4 className="mt-1 text-lg font-semibold">
                      {chapter.title}
                    </h4>

                    <p className="mt-2 text-sm text-zinc-400">
                      {chapter.days}
                    </p>

                  </div>

                  <div className="shrink-0">

                    {isUnlocked ? (
                      <span className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-black">
                        ✓ Unlocked
                      </span>
                    ) : (
                      <span className="rounded-full bg-zinc-800 px-3 py-2 text-sm">
                        🔒 Locked
                      </span>
                    )}

                  </div>

                </div>

                {isUnlocked ? (
                  <Link
                    href={`/book/chapter/${chapter.id}`}
                    className="mt-5 block w-full rounded-xl bg-white px-4 py-3 text-center font-semibold text-black transition hover:bg-zinc-200"
                  >
                    Chapter पढ़ना शुरू करें
                  </Link>
                ) : (
                  <UnlockBookButton
                    bookId={book.id}
                    amount={book.textPrice ?? 49}
                  />
                )}

              </article>
            );
          })}

        </div>
      </section>

    </main>
  );
}