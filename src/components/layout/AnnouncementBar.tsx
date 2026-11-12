import Link from "next/link";
import { SEASONAL, seasonFor } from "@/lib/seasonal";

export function AnnouncementBar() {
  const s = SEASONAL[seasonFor()];
  return (
    <div className="bg-cedar-deep px-4 py-2 text-center text-[12.5px] font-medium tracking-[0.01em] text-white">
      <Link href="/free-assessment" className="hover:underline underline-offset-2">{s.bar} <span aria-hidden>→</span></Link>
    </div>
  );
}
