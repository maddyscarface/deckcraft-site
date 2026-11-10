import Link from "next/link";
export default function NotFound() {
  return (
    <section className="bg-cream px-5 py-28 text-center">
      <h1 className="font-display text-4xl">Page not found.</h1>
      <p className="mt-3 text-hunter/75">The page you were looking for doesn&apos;t exist.</p>
      <div className="mt-6 flex justify-center gap-3"><Link href="/" className="btn btn-hunter">Home</Link><Link href="/free-assessment" className="btn border border-hunter">Free Assessment</Link></div>
    </section>
  );
}
