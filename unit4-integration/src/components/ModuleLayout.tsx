import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';

interface ModuleLayoutProps {
  guide: ReactNode;
  canvas: ReactNode;
}

export default function ModuleLayout({ guide, canvas }: ModuleLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : true
  );

  const getDefaultWidth = () => {
    if (typeof window === 'undefined') return 480;
    if (window.innerWidth >= 1536) return 540;
    if (window.innerWidth >= 1280) return 480;
    return 440;
  };

  const [sidebarWidth, setSidebarWidth] = useState<number>(getDefaultWidth);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleTouchStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (clientX: number) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = clientX - containerRect.left;
      const minWidth = 320;
      const maxWidth = Math.max(minWidth, Math.min(containerRect.width - 360, containerRect.width * 0.65));
      setSidebarWidth(Math.max(minWidth, Math.min(maxWidth, newWidth)));
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX);
    };

    const onEnd = () => setIsDragging(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onEnd);

    const prevCursor = document.body.style.cursor;
    const prevSelect = document.body.style.userSelect;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
      document.body.style.cursor = prevCursor;
      document.body.style.userSelect = prevSelect;
    };
  }, [isDragging]);

  return (
    <div ref={containerRef} className="flex flex-col lg:flex-row flex-1 min-h-0 min-w-0 relative">
      {/* Left Guide Pane */}
      <div
        className="w-full shrink-0 overflow-y-auto border-b lg:border-b-0 px-5 sm:px-6 py-5 sm:py-6 space-y-5 sm:space-y-6"
        style={{
          width: isDesktop ? `${sidebarWidth}px` : '100%',
          borderColor: 'var(--line)',
          backgroundColor: 'var(--panel)',
          borderRight: isDesktop ? '1px solid var(--line)' : undefined,
        }}
      >
        {guide}
      </div>

      {/* Interactive Draggable Split Divider Line */}
      {isDesktop && (
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onDoubleClick={() => setSidebarWidth(getDefaultWidth())}
          className={`hidden lg:flex items-center justify-center w-3 -ml-1.5 -mr-1.5 z-30 cursor-col-resize select-none group transition-colors ${
            isDragging ? 'bg-[var(--teal)]/15' : 'hover:bg-[var(--line)]/60'
          }`}
          title="Drag side-to-side to resize panes (Double-click to reset)"
        >
          <div
            className={`w-1.5 h-16 rounded-full transition-all ${
              isDragging
                ? 'bg-[var(--teal)] shadow-sm scale-y-110'
                : 'bg-[var(--line)] group-hover:bg-[var(--ink-soft)] group-hover:scale-y-110'
            }`}
          />
        </div>
      )}

      {/* Right Simulation Canvas Pane */}
      <div
        className="flex-1 min-w-0 flex flex-col min-h-[60vh] lg:min-h-0 relative overflow-hidden"
        style={{ backgroundColor: 'var(--bg)' }}
      >
        {canvas}
      </div>
    </div>
  );
}
