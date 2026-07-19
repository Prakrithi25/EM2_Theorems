import type { ReactNode } from 'react';

interface ModuleLayoutProps {
  guide: ReactNode;
  canvas: ReactNode;
}

export default function ModuleLayout({ guide, canvas }: ModuleLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">
      <div
        className="w-full lg:w-[45%] flex flex-col sm:flex-row min-h-0 h-full border-b lg:border-b-0 lg:border-r overflow-hidden"
        style={{ borderColor: 'var(--line)', backgroundColor: 'var(--panel)' }}
      >
        {guide}
      </div>
      <div
        className="w-full lg:w-[55%] flex flex-col min-h-[70vh] lg:min-h-0 relative h-full overflow-hidden"
        style={{ backgroundColor: 'var(--bg)' }}
      >
        {canvas}
      </div>
    </div>
  );
}
