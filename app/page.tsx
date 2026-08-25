import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              MyHindiBook
            </h1>
            <p className="text-xs text-zinc-400">
              पढ़िए • सुनिए • खुद को बदलें
            </p>
          </div>
<Link
  href="/auth"
  className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-900"
>
  Login
</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 py-16 text-center">
        <p className="mb-3 text-sm font-medium text-zinc-400">
          आपकी डिजिटल हिंदी लाइब्रेरी
        </p>

        <h2 className="mx-auto max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
          ऐसी किताबें जो आपको
          <span className="block">अंदर से बदलने में मदद करें</span>
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400">
          अपनी पसंद की किताब चुनिए, पढ़ना शुरू कीजिए और अपनी journey
          को chapter by chapter पूरा कीजिए।
        </p>
      </section>

      {/* Books */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="mb-6">
          <h3 className="text-2xl font-bold">मेरी किताबें</h3>
          <p className="mt-1 text-sm text-zinc-400">
            अभी उपलब्ध किताबें
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Book Card */}
          <article className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
            <div className="flex h-64 items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-950 p-6 text-center">
              <div>
                <p className="text-sm text-zinc-400">MY HINDI BOOK</p>
                <h4 className="mt-3 text-3xl font-bold">
                  21 Days
                </h4>
                <p className="mt-2 text-lg text-zinc-300">
                  में खुद को Reboot करे
                </p>
              </div>
            </div>

            <div className="p-5">
              <h4 className="text-xl font-semibold">
                21 दिनों में खुद को Reboot करे
              </h4>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                7 Chapters • 21 Days
              </p>

              <p className="mt-4 text-sm leading-6 text-zinc-300">
                एक practical journey जिसमें हर 3 दिन का एक chapter
                आपको अपने habits, सोच और जीवन को बेहतर समझने में मदद करेगा।
              </p>

              <button className="mt-5 w-full rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:bg-zinc-200">
                किताब पढ़ें
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 text-center text-sm text-zinc-500">
        © 2026 MyHindiBook. All rights reserved.
      </footer>
    </main>
  );
}