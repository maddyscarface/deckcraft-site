import { ServicePage } from "@/components/sections/ServicePage";
import { SERVICES } from "@/lib/services";
import { meta } from "@/lib/seo";

const s = SERVICES["services/new-decks"];
export const metadata = meta("/services/new-decks", s.title, s.description);
export default function Page() {
  return <ServicePage id="services/new-decks" />;
}
