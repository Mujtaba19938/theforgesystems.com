import { MIcon } from "./MIcon";

/* An example fixed-scope proposal: shows what a client gets before work starts. */
const SCOPE_ITEMS = [
  { week: "Week 1", label: "Scope, user flows, and clickable design" },
  { week: "Week 2–4", label: "Build core features and integrations" },
  { week: "Week 5", label: "Testing, fixes, and your feedback round" },
  { week: "Week 6", label: "Launch and handover" },
];

export function ScopePreview() {
  return (
    <div
      className="flex flex-col h-full rounded-2xl border border-white/10 p-5 sm:p-7"
      style={{ background: "rgba(8,8,10,0.6)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-white/40">Example proposal</div>
          <div className="mt-1 text-lg sm:text-xl text-white">MVP build, fixed scope</div>
        </div>
        <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">6 weeks</span>
      </div>

      <ul className="mt-6 flex-1 space-y-3 min-h-0 overflow-hidden">
        {SCOPE_ITEMS.map((item) => (
          <li key={item.week} className="flex items-start gap-3 rounded-xl bg-white/5 border border-white/5 px-4 py-3">
            <MIcon name="check_circle" size={18} fill={1} className="text-white/60 shrink-0 mt-px" />
            <div className="min-w-0">
              <div className="text-xs text-white/40">{item.week}</div>
              <div className="text-sm text-white/85">{item.label}</div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-sm">
        <span className="text-white/50">Price agreed upfront</span>
        <span className="text-white">No surprise invoices</span>
      </div>
    </div>
  );
}
