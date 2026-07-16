import { BlockMath, InlineMath } from 'react-katex';
import type { ReactNode } from 'react';

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="font-display text-lg font-semibold" style={{ color: 'var(--ink)' }}>
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
      className="rounded-lg px-4 py-3 overflow-x-auto"
      style={{ backgroundColor: 'var(--panel-2)', border: '1px solid var(--line)' }}
    >
      {label && (
        <div className="text-xs font-mono-data mb-1" style={{ color: 'var(--ink-soft)' }}>
          {label}
        </div>
      )}
      <BlockMath math={tex} />
    </div>
  );
}

export function Inline({ tex }: { tex: string }) {
  return <InlineMath math={tex} />;
}

export function Readout({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent?: string;
}) {
  const display = typeof value === 'number' ? value.toFixed(4) : value;
  return (
    <div
      className="flex items-center justify-between rounded-lg px-4 py-2.5"
      style={{ backgroundColor: 'var(--panel-2)', border: '1px solid var(--line)' }}
    >
      <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>
        {label}
      </span>
      <span
        className="font-mono-data text-base font-semibold tabular-nums"
        style={{ color: accent ?? 'var(--ink)' }}
      >
        {display}
      </span>
    </div>
  );
}
