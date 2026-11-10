import { ServicePage } from "@/components/sections/ServicePage";
import { SERVICES } from "@/lib/services";
import { meta } from "@/lib/seo";

const s = SERVICES["services/board-railing-stairs"];
export const metadata = meta("/services/board-railing-stairs", s.title, s.description);
export default function Page() {
  return <ServicePage id="services/board-railing-stairs" />;
}
