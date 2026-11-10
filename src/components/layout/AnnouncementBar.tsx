import Link from "next/link";
import { SEASONAL, seasonFor } from "@/lib/seasonal";

export function AnnouncementBar() {
  const s = SEASONAL[seasonFor()];
  return (
    <div className="bg-patina px-4 py-2 text-center text-[13px] text-white">
      <Link href="/free-assessment" className="hover:underline">{s.bar}</Link>
    </div>
  );
}
