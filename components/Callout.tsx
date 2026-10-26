import type { ReactNode } from "react";

type CalloutType = "conseil" | "attention" | "interdiction" | "info" | "astuce" | "important";

interface Props {
  type?: CalloutType;
  children: ReactNode;
}

const STYLES: Record<CalloutType, { emoji: string; bg: string; border: string; label: string; textColor: string }> = {
  conseil:      { emoji: "💡", bg: "bg-amber-50",  border: "border-amber-200",  label: "Conseil",    textColor: "text-amber-900" },
  attention:    { emoji: "⚠️", bg: "bg-orange-50", border: "border-orange-200", label: "Attention",  textColor: "text-orange-900" },
  interdiction: { emoji: "🚫", bg: "bg-red-50",    border: "border-red-200",    label: "À éviter",   textColor: "text-red-900" },
  info:         { emoji: "ℹ️", bg: "bg-blue-50",   border: "border-blue-200",   label: "Info",       textColor: "text-blue-900" },
  astuce:       { emoji: "✨", bg: "bg-green-50",  border: "border-green-200",  label: "Astuce",     textColor: "text-green-900" },
  important:    { emoji: "📌", bg: "bg-purple-50", border: "border-purple-200", label: "Important",  textColor: "text-purple-900" },
};

export function Callout({ type = "conseil", children }: Props) {
  const s = STYLES[type] ?? STYLES.conseil;
  return (
    <aside className={`my-6 flex gap-4 rounded-xl border ${s.border} ${s.bg} px-5 py-4`}>
      <span className="mt-0.5 shrink-0 text-xl" aria-hidden>
        {s.emoji}
      </span>
      <div className={`min-w-0 text-sm leading-relaxed ${s.textColor}`}>
        <p className="mb-1 text-xs font-bold uppercase tracking-wide opacity-70">{s.label}</p>
        {children}
      </div>
    </aside>
  );
}
