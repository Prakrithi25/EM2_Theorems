import type { ReactNode } from 'react';

interface ModuleLayoutProps {
  guide: ReactNode;
  canvas: ReactNode;
}

export default function ModuleLayout({ guide, canvas }: ModuleLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row flex-1 min-h-0">
      <div
        className="w-full lg:w-[40%] overflow-y-auto border-b lg:border-b-0 lg:border-r px-6 py-6 space-y-6"
        style={{ borderColor: 'var(--line)', backgroundColor: 'var(--panel)' }}
      >
        {guide}
      </div>
      <div
        className="w-full lg:w-[60%] flex flex-col min-h-[70vh] lg:min-h-0"
        style={{ backgroundColor: 'var(--bg)' }}
      >
        {canvas}
      </div>
    </div>
  );
}
