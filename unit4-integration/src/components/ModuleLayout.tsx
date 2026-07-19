import type { ReactNode } from 'react';

interface ModuleLayoutProps {
  guide: ReactNode;
  canvas: ReactNode;
}

export default function ModuleLayout({ guide, canvas }: ModuleLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row flex-1 min-h-0 min-w-0">
      <div
        className="w-full lg:w-[440px] xl:w-[480px] 2xl:w-[540px] shrink-0 overflow-y-auto border-b lg:border-b-0 lg:border-r px-5 sm:px-6 py-5 sm:py-6 space-y-5 sm:space-y-6"
        style={{ borderColor: 'var(--line)', backgroundColor: 'var(--panel)' }}
      >
        {guide}
      </div>
      <div
        className="flex-1 min-w-0 flex flex-col min-h-[60vh] lg:min-h-0 relative overflow-hidden"
        style={{ backgroundColor: 'var(--bg)' }}
      >
        {canvas}
      </div>
    </div>
  );
}
