import Link from "next/link";
import { books } from "@/lib/books";
import ReaderContent from "./ReaderContent";


type Props = {
  params: Promise<{
    chapterId: string;
  }>;
};



export default async function ChapterPage({ params }: Props) {
  const { chapterId } = await params;

  const book = books[0];

  const chapter = book.chapters.find(
    (item) => item.id === chapterId
  );

  if (!chapter) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="mx-auto max-w-3xl px-5 py-16">
          <h1 className="text-2xl font-bold">
            Chapter नहीं मिला
          </h1>

          <Link
            href="/book"
            className="mt-6 inline-block rounded-xl bg-white px-5 py-3 font-semibold text-black"
          >
            ← Book पर वापस जाएँ
          </Link>
        </div>
      </main>
    );
  }

    if (chapter.locked) {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <div>
            <p className="text-xs text-zinc-500">
              {book.title}
            </p>

            <h1 className="text-lg font-bold">
              Chapter {chapter.number}
            </h1>
          </div>

          <Link
            href="/book"
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm"
          >
            Book
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-5 py-16">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-7 text-center">
          <div className="text-4xl">🔒</div>

          <p className="mt-4 text-sm text-zinc-500">
            Chapter {chapter.number}
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {chapter.title}
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-zinc-400">
            यह chapter अभी locked है। पूरी किताब unlock करने के बाद
            आप इस chapter को पढ़ सकेंगे।
          </p>

          <div className="mt-7 rounded-xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm text-zinc-500">
              पूरी किताब
            </p>

            <p className="mt-1 text-3xl font-bold">
              ₹{book.textPrice}
            </p>

            <p className="mt-2 text-sm text-zinc-500">
              सभी 7 Chapters • 21 Days
            </p>
          </div>

          <button
            className="mt-6 w-full rounded-xl bg-white px-5 py-3 font-semibold text-black"
          >
            🔓 ₹{book.textPrice} में पूरी किताब Unlock करें
          </button>

          <Link
            href="/book"
            className="mt-3 block rounded-xl border border-zinc-700 px-5 py-3 text-sm font-semibold"
          >
            ← सभी Chapters
          </Link>
        </div>
      </section>
    </main>
  );
}


  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">

          <div>
            <p className="text-xs text-zinc-500">
              {book.title}
            </p>

            <h1 className="text-lg font-bold">
              Chapter {chapter.number}
            </h1>
          </div>

          <Link
            href="/book"
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm"
          >
            Book
          </Link>

        </div>
      </header>

      {/* Chapter Header */}
      <article className="mx-auto max-w-3xl px-5 py-10">

        <p className="text-sm text-zinc-500">
          Chapter {chapter.number}
        </p>

        <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
          {chapter.title}
        </h2>

        {chapter.days && (
          <p className="mt-3 text-sm text-zinc-500">
            {chapter.days}
          </p>
        )}

        {/* Audio */}
        {chapter.audioAvailable && chapter.audioUrl && (
          <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="mb-3 text-sm text-zinc-400">
              🎧 Chapter Audio
            </p>

            <audio
              controls
              className="w-full"
              src={chapter.audioUrl}
            />
          </div>
        )}

        {/* Text */}
{chapter.textAvailable && (
  <div className="mt-8">
    {chapter.content ? (
      <ReaderContent content={chapter.content} />
    ) : (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <p className="text-lg leading-8 text-zinc-300">
          इस chapter का content अभी जोड़ा नहीं गया है।
        </p>
      </div>
    )}
  </div>
)}

        {/* Chapter Navigation */}
<div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">

  {chapter.number > 1 ? (
    <Link
      href={`/book/chapter/${
        book.chapters[chapter.number - 2].id
      }`}
      className="rounded-xl border border-zinc-700 px-5 py-3 text-center text-sm font-semibold"
    >
      ← Previous
    </Link>
  ) : (
    <div />
  )}

  <Link
    href="/book"
    className="rounded-xl border border-zinc-700 px-5 py-3 text-center text-sm font-semibold"
  >
    All Chapters
  </Link>

  {chapter.number < book.chapters.length ? (
    <Link
      href={`/book/chapter/${
        book.chapters[chapter.number].id
      }`}
      className="rounded-xl bg-white px-5 py-3 text-center text-sm font-semibold text-black"
    >
      Next Chapter →
    </Link>
  ) : (
    <div />
  )}

</div>

      </article>
    </main>
  );
}