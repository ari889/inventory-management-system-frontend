// ─── Animated slide-up/down children container ───────────────────────────────
"use client";
import { useEffect, useRef, useState } from "react";

export default function AnimatedChildren({
  expanded,
  isDragging,
  children,
}: {
  expanded: boolean;
  isDragging: boolean;
  children: React.ReactNode;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    // Measure immediately
    setContentHeight(el.scrollHeight);
    // Keep measuring as children change (items added/removed)
    const ro = new ResizeObserver(() => setContentHeight(el.scrollHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      style={{
        // Lock open during drag — AnimatedChildren is no longer inside the
        // sortable transform div, so ResizeObserver feedback loop is gone.
        height: isDragging ? contentHeight : expanded ? contentHeight : 0,
        overflow: "hidden",
        // Skip transition during drag so dnd-kit measures stable positions
        transition: isDragging
          ? "none"
          : "height 220ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div ref={innerRef}>{children}</div>
    </div>
  );
}
