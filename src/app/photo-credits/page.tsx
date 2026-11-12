import { meta } from "@/lib/seo";
import { PageHero } from "@/components/sections/Blocks";
import { PHOTOS } from "@/lib/photos";

export const metadata = meta("/photo-credits", "Photo Credits | DeckCraft Boston", "Sources and licences for the photography used on this site.", { noindex: true });

export default function Page() {
  return (
    <>
      <PageHero compact eyebrow="PHOTO CREDITS" h1="Where our photos come from." sub="The photography on this site is licensed stock, used to illustrate the kind of work and settings we serve. It is not DeckCraft project work. Real job photos are added to the gallery only with the owner's permission." />
      <section className="bg-bone px-5 py-16">
        <div className="mx-auto max-w-5xl overflow-x-auto border border-line bg-white">
          <table className="w-full min-w-[640px] text-left text-[14.5px]">
            <thead className="bg-char text-white"><tr><th className="p-4">Image</th><th className="p-4">Photographer</th><th className="p-4">Source and licence</th></tr></thead>
            <tbody>
              {Object.entries(PHOTOS).map(([k, p]) => (
                <tr key={k} className="border-t border-line align-top">
                  <td className="p-4">{p.alt}</td>
                  <td className="p-4">{p.photographer}</td>
                  <td className="p-4"><a className="underline" href={p.sourceUrl} rel="noopener" target="_blank">Pexels</a> · {p.license}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
