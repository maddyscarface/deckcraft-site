import { ServicePage } from "@/components/sections/ServicePage";
import { SERVICES } from "@/lib/services";
import { meta } from "@/lib/seo";

const s = SERVICES["services/deck-rebuild-resurfacing"];
export const metadata = meta("/services/deck-rebuild-resurfacing", s.title, s.description);
export default function Page() {
  return <ServicePage id="services/deck-rebuild-resurfacing" />;
}
