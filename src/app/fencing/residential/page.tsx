import { ServicePage } from "@/components/sections/ServicePage";
import { SERVICES } from "@/lib/services";
import { meta } from "@/lib/seo";

const s = SERVICES["fencing/residential"];
export const metadata = meta("/fencing/residential", s.title, s.description);
export default function Page() {
  return <ServicePage id="fencing/residential" />;
}
