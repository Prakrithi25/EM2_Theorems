import { MathJax } from 'better-react-mathjax';
import type { ReactNode } from 'react';
import { Lightbulb, Rocket, HelpCircle } from 'lucide-react';

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2.5">
      <h3 className="font-display text-lg font-bold tracking-tight" style={{ color: 'var(--ink)' }}>
        {title}
      </h3>
      <div className="text-sm leading-relaxed space-y-2" style={{ color: 'var(--ink-soft)' }}>
        {children}
      </div>
    </section>
  );
}

export function Equation({ tex, label }: { tex: string; label?: string }) {
  return (
    <div
      className="rounded-lg px-4 py-3 overflow-x-auto my-3 shadow-xs"
      style={{ backgroundColor: 'var(--panel-2)', border: '1px solid var(--line)' }}
    >
      {label && (
        <div className="text-xs font-mono-data mb-1.5 font-semibold tracking-wide" style={{ color: 'var(--ink)' }}>
          {label}
        </div>
      )}
      <MathJax dynamic={true} className="flex justify-center text-center py-1 font-medium">
        {`\\[${tex}\\]`}
      </MathJax>
    </div>
  );
}

export function Inline({ tex }: { tex: string }) {
  // Bypassing MathJax promises for single letters / simple symbols avoids global typeset queue deadlocks on navigation
  if (/^[A-Za-z0-9]$/.test(tex)) {
    return <span className="inline-block align-baseline font-serif italic font-semibold mx-0.5" style={{ color: 'var(--ink)' }}>{tex}</span>;
  }
  const boldMatch = tex.match(/^\\mathbf\{([A-Za-z0-9])\}$/);
  if (boldMatch) {
    return <span className="inline-block align-baseline font-sans font-bold mx-0.5" style={{ color: 'var(--ink)' }}>{boldMatch[1]}</span>;
  }

  return (
    <MathJax dynamic={true} inline className="inline-block align-baseline font-medium mx-0.5">
      {`\\(${tex}\\)`}
    </MathJax>
  );
}

export function Readout({
  label,
  value,
  accent,
}: {
  label: ReactNode | string;
  value: number | string;
  accent?: string;
}) {
  const display = typeof value === 'number' ? value.toFixed(4) : value;
  return (
    <div
      className="flex items-center justify-between rounded-lg px-4 py-2.5 my-1.5 transition-all shadow-2xs"
      style={{ backgroundColor: 'var(--panel-2)', border: '1px solid var(--line)' }}
    >
      <div className="text-sm font-medium flex items-center gap-1.5" style={{ color: 'var(--ink)' }}>
        {label}
      </div>
      <span
        className="font-mono-data text-base font-bold tabular-nums"
        style={{ color: accent ?? 'var(--ink)' }}
      >
        {display}
      </span>
    </div>
  );
}

export function PillarCard({
  title,
  icon,
  accent = 'var(--teal)',
  children,
}: {
  title: string;
  icon?: ReactNode;
  accent?: string;
  children: ReactNode;
}) {
  return (
    <div
      className="rounded-xl p-4 sm:p-5 border space-y-3 transition-all shadow-xs my-4"
      style={{
        backgroundColor: 'var(--panel)',
        borderColor: 'var(--line)',
        borderLeft: `4px solid ${accent}`,
      }}
    >
      <div className="flex items-center gap-2.5 font-display text-base sm:text-lg font-bold">
        <span className="shrink-0" style={{ color: accent }}>
          {icon ?? <HelpCircle className="w-5 h-5" />}
        </span>
        <span style={{ color: 'var(--ink)' }}>{title.replace(/^[💡👋🚀✈️📡🌪️🗺️📐📦🧪🧮⚡🎯🔍👉✨]\s*/, '')}</span>
      </div>
      <div className="text-sm leading-relaxed space-y-2.5" style={{ color: 'var(--ink-soft)' }}>
        {children}
      </div>
    </div>
  );
}

export function IntuitionBox({
  title = 'Core Analogy & Intuition',
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  const cleanTitle = title.replace(/^[💡👋🚀✈️📡🌪️🗺️📐📦🧪🧮⚡🎯🔍👉✨]\s*/, '');
  return (
    <div
      className="rounded-xl p-4 border space-y-2 my-3"
      style={{
        backgroundColor: 'var(--panel-2)',
        borderColor: 'var(--amber)',
        borderLeft: '4px solid var(--amber)',
      }}
    >
      <div className="font-display font-bold text-sm flex items-center gap-2">
        <Lightbulb className="w-4 h-4 shrink-0 text-amber-400" />
        <span style={{ color: 'var(--ink)' }}>{cleanTitle}</span>
      </div>
      <div className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
        {children}
      </div>
    </div>
  );
}

export function ControlGuide({
  items,
}: {
  items: { label: string; desc: string; badgeColor?: string }[];
}) {
  return (
    <div className="space-y-2 my-3">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 p-2.5 rounded-lg border text-xs sm:text-sm"
          style={{ backgroundColor: 'var(--panel-2)', borderColor: 'var(--line)' }}
        >
          <span
            className="font-semibold shrink-0 px-2 py-0.5 rounded text-xs uppercase tracking-wider"
            style={{
              backgroundColor: item.badgeColor ? `${item.badgeColor}22` : 'var(--line)',
              color: item.badgeColor ?? 'var(--ink)',
              border: `1px solid ${item.badgeColor ? `${item.badgeColor}55` : 'var(--line)'}`,
            }}
          >
            {item.label}
          </span>
          <span style={{ color: 'var(--ink-soft)' }} className="flex-1">
            {item.desc}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ImpactBox({
  items,
}: {
  items: { title: string; desc: string }[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
      {items.map((item, idx) => {
        const cleanTitle = item.title.replace(/^[💡👋🚀✈️📡🌪️🗺️📐📦🧪🧮⚡🎯🔍👉✨]\s*/, '');
        return (
          <div
            key={idx}
            className="p-3.5 rounded-xl border space-y-1.5 transition-all hover:border-[var(--teal)]"
            style={{ backgroundColor: 'var(--panel-2)', borderColor: 'var(--line)' }}
          >
            <div className="font-display font-bold text-xs sm:text-sm flex items-center gap-2">
              <Rocket className="w-4 h-4 shrink-0 text-[var(--teal)]" />
              <span style={{ color: 'var(--ink)' }}>{cleanTitle}</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              {item.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}

