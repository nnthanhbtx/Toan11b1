import React, { useEffect, useRef, useState } from 'react';

interface TikzComponentProps {
  code: string;
}

export const TikzComponent: React.FC<TikzComponentProps> = ({ code }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check if tikzjax is available on window
    const win = window as unknown as { process_tikz?: (elem: Node) => void };

    try {
      containerRef.current.innerHTML = `<script type="text/tikz">${code}</script>`;
      if (typeof win.process_tikz === 'function' && containerRef.current.firstChild) {
        win.process_tikz(containerRef.current.firstChild);
      } else {
        document.dispatchEvent(new Event('DOMContentLoaded'));
      }

      // Check if rendered within 800ms; if not, show crisp SVG fallback
      const timer = setTimeout(() => {
        if (containerRef.current && !containerRef.current.querySelector('svg')) {
          setUseFallback(true);
        }
      }, 900);

      return () => clearTimeout(timer);
    } catch {
      setUseFallback(true);
    }
  }, [code]);

  // If TikZ isn't rendered or is taking too long, render dedicated crisp SVG for trigonometry
  const isQuadrant2 = code.includes('II') || code.includes('rectangle (0,1)');
  const isAngle5pi6 = code.includes('5\\pi') || code.includes('150');

  return (
    <div className="flex flex-col items-center justify-center bg-white text-slate-900 rounded-2xl p-2 sm:p-3 overflow-x-auto w-full max-w-[240px] sm:max-w-xs mx-auto my-2 sm:my-3 shadow-lg border border-blue-200">
      <div ref={containerRef} className={useFallback ? 'hidden' : 'flex justify-center w-full'} />
      {useFallback && (
        <div className="flex flex-col items-center">
          <svg viewBox="-140 -140 280 280" className="w-36 h-36 sm:w-48 sm:h-48">
            {/* Coordinate axes */}
            <line x1="-120" y1="0" x2="120" y2="0" stroke="#64748b" strokeWidth="1.5" />
            <polygon points="120,0 112,-4 112,4" fill="#64748b" />
            <text x="125" y="4" fontSize="12" fill="#334155" fontWeight="bold">x</text>

            <line x1="0" y1="120" x2="0" y2="-120" stroke="#64748b" strokeWidth="1.5" />
            <polygon points="0,-120 -4,-112 4,-112" fill="#64748b" />
            <text x="4" y="-125" fontSize="12" fill="#334155" fontWeight="bold">y</text>

            {/* Unit circle */}
            <circle cx="0" cy="0" r="80" fill="none" stroke="#2563eb" strokeWidth="2" />
            <text x="-8" y="14" fontSize="10" fill="#64748b">O</text>

            {/* Quadrant II highlight */}
            {isQuadrant2 && (
              <>
                <rect x="-80" y="-80" width="80" height="80" fill="#ef4444" fillOpacity="0.25" rx="4" />
                <text x="-48" y="-40" fontSize="18" fill="#dc2626" fontWeight="bold">II</text>
                <text x="40" y="-40" fontSize="14" fill="#94a3b8">I</text>
                <text x="-48" y="48" fontSize="14" fill="#94a3b8">III</text>
                <text x="40" y="48" fontSize="14" fill="#94a3b8">IV</text>
              </>
            )}

            {/* Angle 5pi/6 (150 deg) */}
            {isAngle5pi6 && (
              <>
                {/* 150 deg in SVG coordinates: angle from positive x-axis CCW: cos(150)=-0.866, sin(150)=0.5 -> SVG y is inverted */}
                <line x1="0" y1="0" x2="-69.28" y2="-40" stroke="#2563eb" strokeWidth="3" />
                <circle cx="-69.28" cy="-40" r="4" fill="#2563eb" />
                <path d="M 30 0 A 30 30 0 0 0 -25.98 -15" fill="none" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow)" />
                <text x="-75" y="-50" fontSize="13" fill="#1d4ed8" fontWeight="bold">5π/6</text>
                <text x="12" y="-18" fontSize="11" fill="#dc2626" fontWeight="bold">150°</text>
              </>
            )}
          </svg>
          <span className="text-[11px] text-slate-500 mt-1 italic">Đường tròn lượng giác minh họa</span>
        </div>
      )}
    </div>
  );
};
