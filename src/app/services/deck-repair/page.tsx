import { ServicePage } from "@/components/sections/ServicePage";
import { SERVICES } from "@/lib/services";
import { meta } from "@/lib/seo";

const s = SERVICES["services/deck-repair"];
export const metadata = meta("/services/deck-repair", s.title, s.description);
export default function Page() {
  return <ServicePage id="services/deck-repair" />;
}
