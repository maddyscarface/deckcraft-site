import { meta } from "@/lib/seo";
import { PageHero } from "@/components/sections/Blocks";
import { PrivacyChoicesLink } from "@/components/ui/PrivacyChoicesLink";

export const metadata = meta("/privacy", "Privacy Policy | DeckCraft Boston", "How DeckCraft Boston collects, uses and protects your information.");

/* DRAFT — must be reviewed by a qualified attorney before launch. */
export default function Page() {
  return (
    <>
      <PageHero compact h1="Privacy Policy" sub="Draft for legal review. Last updated November 2, 2026." />
      <section className="bg-cream px-5 py-14">
        <div className="prose-dc mx-auto max-w-3xl">
          <h2>What we collect</h2>
          <p>When you request an assessment or walkthrough we collect the details you give us: name, email, phone, town or property addresses, project details, and photos or documents you upload. We also collect basic technical and marketing information, such as pages viewed, the ad or link that brought you here (UTM parameters and click identifiers), and cookies set by analytics and advertising tools.</p>
          <h2>How we use it</h2>
          <ul><li>To review your project, respond, schedule visits and prepare proposals.</li><li>To send texts about your request if you opted in, and emails about your request.</li><li>To send seasonal tips if you subscribed (unsubscribe anytime).</li><li>To measure which advertising works, including sharing hashed contact details and conversion events with Google and Meta.</li></ul>
          <h2>Your photos</h2>
          <p>Photos are stored privately and seen only by our team and the people working on your project. We never publish or share them without your written permission.</p>
          <h2>Who we share it with</h2>
          <p>Service providers that help us operate: website hosting, our CRM, data storage, email and SMS delivery, analytics and advertising platforms. We do not sell your personal information.</p>
          <h2>Your choices</h2>
          <p>You can opt out of texts by replying STOP, unsubscribe from emails using the link in any email, and ask us to access or delete your information by emailing hello@deckcraftboston.com. We honor Global Privacy Control signals for advertising cookies. <PrivacyChoicesLink /></p>
          <h2>Retention and security</h2>
          <p>We keep records as long as needed to serve you and meet legal and tax obligations, and protect them with access controls and encryption in transit.</p>
          <h2>Contact</h2>
          <p>DeckCraft Boston · hello@deckcraftboston.com</p>
        </div>
      </section>
    </>
  );
}
