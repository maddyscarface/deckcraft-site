import { listLeads, type StoredLead } from "@/lib/server/store";
import { integrationStatus } from "@/lib/server/env";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard", robots: { index: false, follow: false } };

function count<T extends string>(rows: StoredLead[], key: string) {
  const m = new Map<string, number>();
  for (const r of rows) { const k = String(r[key] ?? "—"); m.set(k, (m.get(k) ?? 0) + 1); }
  return [...m.entries()].sort((a, b) => b[1] - a[1]) as [T, number][];
}

export default async function Admin({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { view } = await searchParams;
  let rows: StoredLead[] = [];
  let err = "";
  try { rows = await listLeads(1000); } catch (e) { err = String(e); }
  const st = integrationStatus();
  const d30 = rows.filter((r) => Date.now() - new Date(r.created_at).getTime() < 30 * 864e5);
  const withPhotos = d30.filter((r) => Array.isArray(r.photo_urls) && (r.photo_urls as unknown[]).length).length;
  const property = d30.filter((r) => r.pipeline === "commercial").length;
  const failed = rows.filter((r) => r.ghl_sync_status === "failed").length;
  const bdr = [...rows].filter((r) => r.status === "new").sort((a, b) => Number(b.lead_score ?? 0) - Number(a.lead_score ?? 0)).slice(0, 25);

  const Tile = ({ k, v, s }: { k: string; v: string | number; s?: string }) => (
    <div className="rounded-[2px] bg-white p-5 shadow-card"><p className="text-xs font-semibold tracking-wider text-patina uppercase">{k}</p><p className="mt-1 font-display text-3xl">{v}</p>{s && <p className="text-xs text-hunter/60">{s}</p>}</div>
  );
  const Table = ({ title, data }: { title: string; data: [string, number][] }) => (
    <div className="rounded-[2px] bg-white p-5 shadow-card"><h3 className="font-semibold">{title}</h3><table className="mt-3 w-full text-sm"><tbody>{data.slice(0, 10).map(([k, v]) => <tr key={k} className="border-t border-cream-dark"><td className="py-1.5">{k}</td><td className="text-right font-semibold">{v}</td></tr>)}</tbody></table></div>
  );

  return (
    <section className="bg-cream px-5 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-3xl">{view === "bdr" ? "BDR call list" : "Owner dashboard"}</h1>
          <nav className="flex gap-2 text-sm"><a href="/admin" className="btn border border-hunter !min-h-9">Owner</a><a href="/admin?view=bdr" className="btn border border-hunter !min-h-9">BDR</a></nav>
        </div>
        <p className="mt-2 text-sm text-hunter/70">
          Integrations: {Object.entries(st).map(([k, v]) => <span key={k} className={`mr-2 rounded px-2 py-0.5 ${v ? "bg-patina text-white" : "bg-cream-dark"}`}>{k}: {v ? "configured" : "not set"}</span>)}
        </p>
        <p className="mt-1 text-xs text-hunter/60">&quot;Configured&quot; means a key is present, not that the connection was tested. Run the verification checklist in docs/08-tracking.md.</p>
        {err && <p className="err mt-4">{err}</p>}

        {view === "bdr" ? (
          <div className="mt-8 overflow-x-auto rounded-[2px] bg-white shadow-card">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-hunter text-left text-white"><tr>{["Score", "Received", "Name", "Segment", "Funnel", "Town", "Phone", "Photos", "Timeline", "GHL"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
              <tbody>{bdr.map((r) => (
                <tr key={r.id} className="border-t border-cream-dark">
                  <td className="p-3 font-semibold">{String(r.lead_score ?? "")}</td><td className="p-3">{new Date(r.created_at).toLocaleString("en-US", { timeZone: "America/New_York" })}</td>
                  <td className="p-3">{String(r.first_name ?? "")} {String(r.last_name ?? "")}{r.company_name ? ` · ${r.company_name}` : ""}</td>
                  <td className="p-3">{String(r.customer_type ?? "")}</td><td className="p-3">{String(r.funnel ?? "")}</td><td className="p-3">{String(r.town ?? "")}</td>
                  <td className="p-3">{String(r.phone ?? "")}</td><td className="p-3">{Array.isArray(r.photo_urls) ? (r.photo_urls as unknown[]).length : 0}</td>
                  <td className="p-3">{String(r.timeline ?? "")}</td><td className="p-3">{r.ghl_sync_status}</td>
                </tr>))}
                {!bdr.length && <tr><td className="p-6 text-hunter/60" colSpan={10}>No new leads.</td></tr>}
              </tbody>
            </table>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <Tile k="Leads (30d)" v={d30.length} />
              <Tile k="With photos" v={d30.length ? `${Math.round((withPhotos / d30.length) * 100)}%` : "—"} s="photo submission rate" />
              <Tile k="Property leads" v={property} s="commercial pipeline, 30d" />
              <Tile k="GHL sync failures" v={failed} s="retry job runs every 15 min" />
              <Tile k="All-time leads" v={rows.length} />
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Table title="By funnel" data={count(d30, "funnel")} />
              <Table title="By segment" data={count(d30, "customer_type")} />
              <Table title="By town" data={count(d30, "town")} />
              <Table title="By source" data={count(d30, "utm_source")} />
            </div>
            <div className="mt-6 rounded-[2px] border border-dashed border-hunter p-5 text-sm">
              <p className="font-semibold">Spend, CAC, show rate, close rate, revenue and margin</p>
              <p className="mt-1 text-hunter/70">These need ad spend (Google Ads, Meta, LSA) and GHL opportunity stages/values. The data model and SQL views are in <code>supabase/schema.sql</code> (<code>v_kpi_channel_month</code>) and the spec is docs/12-dashboards-kpis.md. Connect the daily spend import and GHL opportunity sync to populate them.</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
