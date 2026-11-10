import { ServicePage } from "@/components/sections/ServicePage";
import { SERVICES } from "@/lib/services";
import { meta } from "@/lib/seo";

const s = SERVICES["services/deck-staining-sealing"];
export const metadata = meta("/services/deck-staining-sealing", s.title, s.description);
export default function Page() {
  return <ServicePage id="services/deck-staining-sealing" />;
}
