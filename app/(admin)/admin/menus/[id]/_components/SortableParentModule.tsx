// ─── Sortable Parent Module ───────────────────────────────────────────────────

import { FlatModule, SkeletonPosition } from "@/@types/module.types";
import { UniqueIdentifier } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Module from "./Module";
import AnimatedChildren from "./AnimatedChildren";
import SkeletonRow from "./SkeletonRow";
import SortableChildModule from "./SortableChildModule";
import ChildDropZoneWrapper from "./ChildDropZoneWrapper";

export default function SortableParentModule({
  module,
  childModules,
  skeletonPos,
  activeId,
  isDragging: externalIsDragging,
  expanded,
  onToggleExpand,
  openModal,
  onDeleteSuccess,
}: {
  module: FlatModule;
  childModules: FlatModule[];
  skeletonPos: SkeletonPosition | null;
  activeId: UniqueIdentifier | null;
  isDragging: boolean;
  expanded: boolean;
  onToggleExpand: (id: number) => void;
  openModal: (id: number) => void;
  onDeleteSuccess: (id: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id, data: { type: "parent", module } });

  const isDrag = isDragging || externalIsDragging;

  // setNodeRef goes on the outermost element so dnd-kit measures the
  // true bounding rect (including margin space) and the pointer stays aligned.
  return (
    <>
      <div
        ref={setNodeRef}
        style={{
          transform: CSS.Translate.toString(transform),
          transition,
          opacity: isDragging ? 0.2 : 1,
        }}
        className="mb-1"
      >
        <Module
          module={module.data}
          isChild={false}
          order={module.order}
          openModal={openModal}
          hasChildren={childModules.length > 0}
          expanded={expanded}
          onToggleExpand={() => onToggleExpand(module.id)}
          dragHandleProps={{ ...attributes, ...(listeners ?? {}) }}
          onDeleteSuccess={onDeleteSuccess}
        />
      </div>

      {/* AnimatedChildren is a sibling of setNodeRef — never nested inside it.
          This prevents ResizeObserver from fighting dnd-kit transforms. */}
      <AnimatedChildren expanded={expanded} isDragging={isDrag}>
        {childModules.length > 0 && (
          <SortableContext
            items={childModules.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="pl-10 pt-1 flex flex-col gap-2">
              {childModules.flatMap((child, ci) => {
                const showSkeleton =
                  skeletonPos?.parentId === module.id &&
                  skeletonPos.index === ci &&
                  activeId !== child.id;
                return [
                  showSkeleton ? (
                    <SkeletonRow key={`skel-${ci}`} isChild />
                  ) : null,
                  <SortableChildModule
                    key={child.id}
                    module={child}
                    openModal={openModal}
                    onDeleteSuccess={onDeleteSuccess}
                  />,
                ].filter(Boolean);
              })}
            </div>
          </SortableContext>
        )}
      </AnimatedChildren>

      {/* ChildDropZoneWrapper is always a sibling — never inside AnimatedChildren.
          It must be reachable by the dnd-kit pointer hit-test even when collapsed. */}
      <ChildDropZoneWrapper
        parentId={module.id}
        isActive={!!activeId && !isDrag}
      >
        {childModules.length === 0 && !!activeId && !isDrag && (
          <p className="text-center text-xs text-gray-400 py-2">
            Drop here to nest
          </p>
        )}
      </ChildDropZoneWrapper>
    </>
  );
}
