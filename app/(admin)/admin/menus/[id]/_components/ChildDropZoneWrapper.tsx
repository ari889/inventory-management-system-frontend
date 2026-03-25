// ─── Child Drop Zone ──────────────────────────────────────────────────────────

import { useDroppable } from "@dnd-kit/core";

export default function ChildDropZoneWrapper({
  parentId,
  isActive,
  children,
}: {
  parentId: number;
  isActive: boolean;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `dropzone-${parentId}`,
    data: { type: "childZone", parentId },
  });

  return (
    <div
      ref={setNodeRef}
      className="ml-10 rounded-lg"
      style={{
        minHeight: isActive ? 44 : 0,
        border: isActive
          ? `2px dashed ${isOver ? "#111827" : "rgba(0,0,0,0.2)"}`
          : "2px dashed transparent",
        background: isOver && isActive ? "rgba(0,0,0,0.03)" : "transparent",
        padding: isActive ? 4 : 0,
        transition: "min-height 150ms, background 150ms, border-color 150ms",
      }}
    >
      {children}
    </div>
  );
}
