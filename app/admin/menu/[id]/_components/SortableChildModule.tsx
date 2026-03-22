// ─── Sortable Child Module ────────────────────────────────────────────────────
"use client";
import { FlatModule } from "@/@types/module.types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Module from "./Module";

export default function SortableChildModule({
  module,
  openModal,
}: {
  module: FlatModule;
  openModal: (id: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id, data: { type: "child", module } });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.2 : 1,
      }}
    >
      <Module
        module={module.data}
        isChild
        order={module.order}
        openModal={openModal}
        dragHandleProps={{ ...attributes, ...(listeners ?? {}) }}
      />
    </div>
  );
}
