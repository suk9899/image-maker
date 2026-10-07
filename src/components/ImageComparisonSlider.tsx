import React, { useState, useRef, useCallback } from 'react';
import { SlidersVertical, MoveHorizontal, Download, Eye, Maximize2 } from 'lucide-react';

interface ImageComparisonSliderProps {
  beforeImage?: string;
  afterImage: string;
  className?: string;
}

export const ImageComparisonSlider: React.FC<ImageComparisonSliderProps> = ({
  beforeImage,
  afterImage,
  className = '',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      let percentage = (x / rect.width) * 100;
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;
      setSliderPosition(percentage);
    },
    []
  );

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // If no before image provided, just render after image clearly
  if (!beforeImage) {
    return (
      <div className={`relative overflow-hidden rounded-xl bg-slate-950 border border-slate-800 ${className}`}>
        <img src={afterImage} alt="Generated Result" className="w-full h-full object-contain" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      className={`relative select-none overflow-hidden rounded-xl bg-slate-950 border border-slate-800 cursor-ew-resize group ${className}`}
    >
      {/* Before Image (Background full width) */}
      <img
        src={beforeImage}
        alt="Before (Original)"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      />

      {/* Before Label Badge */}
      <span className="absolute top-3 left-3 z-10 px-2 py-0.5 text-[10px] font-extrabold bg-slate-950/80 border border-slate-700 text-slate-300 rounded backdrop-blur-sm pointer-events-none">
        원본 (BEFORE)
      </span>

      {/* After Image (Clipped overlay) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={afterImage}
          alt="After (Generated)"
          className="absolute inset-0 w-full h-full object-contain max-w-none"
          style={{ width: containerRef.current?.clientWidth || '100%' }}
        />
        {/* After Label Badge */}
        <span className="absolute top-3 left-3 z-10 px-2 py-0.5 text-[10px] font-extrabold bg-amber-500/90 text-slate-950 rounded shadow backdrop-blur-sm">
          나노 바나나 생성 (AFTER)
        </span>
      </div>

      {/* Slider Divider Line & Knob */}
      <div
        className="absolute top-0 bottom-0 z-20 w-1 bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.8)] pointer-events-none"
        style={{ left: `calc(${sliderPosition}% - 2px)` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-xl border-2 border-slate-900 group-hover:scale-110 transition-transform">
          <MoveHorizontal className="w-4 h-4 font-extrabold" />
        </div>
      </div>
    </div>
  );
};
