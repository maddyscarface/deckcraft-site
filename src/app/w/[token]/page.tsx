import type { Metadata } from "next";
import { BRAND, flags } from "@/lib/p4/flags";
import { publicState, resolveToken } from "@/lib/walkthrough/service";
import { uploadMode } from "@/lib/walkthrough/uploads";
import { durableStorage } from "@/lib/p4/db";
import { WalkthroughApp } from "@/components/walkthrough/WalkthroughApp";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your walkthrough", robots: { index: false, follow: false, nocache: true }, referrer: "no-referrer" };

export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const r = flags().walkthrough ? await resolveToken(BRAND, token) : null;
  if (!r) {
    return (
      <section className="min-h-[70vh] bg-bone px-5 py-16">
        <div className="mx-auto max-w-md bg-white p-7 shadow-card" data-testid="link-gone">
          <p className="eyebrow text-cedar">DeckCraft</p>
          <h1 className="mt-3 font-display text-2xl text-char">This link isn&rsquo;t active</h1>
          <p className="mt-3 text-[15px] text-char/80">It may have expired or been replaced. Email <a className="font-semibold underline" href="mailto:info@deckcraftbuild.com">info@deckcraftbuild.com</a> and we&rsquo;ll send a new one.</p>
          {!durableStorage() && <p className="mt-3 text-xs text-stone" data-testid="storage-demo-note">Preview environment: durable storage isn&rsquo;t connected, so links can&rsquo;t be shared between servers here.</p>}
        </div>
      </section>
    );
  }
  const initial = await publicState(BRAND, r, uploadMode());
  return <WalkthroughApp token={token} initial={JSON.parse(JSON.stringify(initial))} />;
}
