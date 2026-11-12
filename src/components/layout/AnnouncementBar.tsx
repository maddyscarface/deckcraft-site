import Link from "next/link";
import { activeSeasonal } from "@/config/seasonal";

export function AnnouncementBar() {
  const s = activeSeasonal();
  if (!s) return null;
  return (
    <div className="bg-navy px-4 py-2 text-center text-[12.5px] font-medium tracking-[0.01em] text-white/90 border-b border-white/10" data-seasonal={s.id}>
      <Link href={s.cta.href} className="hover:underline underline-offset-2">{s.bar} <span aria-hidden className="text-cedar-light">→</span></Link>
    </div>
  );
}
