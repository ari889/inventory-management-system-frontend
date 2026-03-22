"use client";

import { useReducer, useRef, useEffect } from "react";
import {
  DndContext,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  MeasuringStrategy,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { ModulesState, Module as ModuleType } from "@/@types/module.types";
import EditModule from "./EditModule";
import { extractModule, flattenModules, reorder } from "@/utils/common";
import SkeletonRow from "./SkeletonRow";
import SortableParentModule from "./SortableParentModule";
import DragCard from "./DragCard";

type ModulesAction =
  | { type: "DRAG_START"; activeId: UniqueIdentifier }
  | { type: "DRAG_OVER"; parentId: UniqueIdentifier | null; index: number }
  | { type: "DRAG_OVER_CLEAR" }
  | { type: "DRAG_END" }
  | { type: "EXPAND_TOGGLE"; id: number }
  | { type: "EXPAND_ADD"; id: number }
  | { type: "MODAL_OPEN"; id: number }
  | { type: "MODAL_CLOSE" };

const initialState: ModulesState = {
  activeId: null,
  skeletonParentId: null,
  skeletonIndex: null,
  expanded: new Set(),
  selectedModule: null,
  modalOpen: false,
};

function reducer(state: ModulesState, action: ModulesAction): ModulesState {
  switch (action.type) {
    case "DRAG_START":
      return {
        ...state,
        activeId: action.activeId,
        skeletonParentId: null,
        skeletonIndex: null,
      };

    case "DRAG_OVER":
      return {
        ...state,
        skeletonParentId: action.parentId,
        skeletonIndex: action.index,
      };

    case "DRAG_OVER_CLEAR":
      return { ...state, skeletonParentId: null, skeletonIndex: null };

    case "DRAG_END":
      return {
        ...state,
        activeId: null,
        skeletonParentId: null,
        skeletonIndex: null,
      };

    case "EXPAND_TOGGLE": {
      const next = new Set(state.expanded);
      if (next.has(action.id)) {
        next.delete(action.id);
      } else {
        next.add(action.id);
      }
      return { ...state, expanded: next };
    }

    case "EXPAND_ADD":
      return { ...state, expanded: new Set([...state.expanded, action.id]) };

    case "MODAL_OPEN":
      return { ...state, selectedModule: action.id, modalOpen: true };

    case "MODAL_CLOSE":
      return { ...state, selectedModule: null, modalOpen: false };

    default:
      return state;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

const Modules = ({
  modules,
  setModules,
}: {
  modules: ModuleType[];
  setModules: React.Dispatch<React.SetStateAction<ModuleType[]>>;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    activeId,
    skeletonParentId,
    skeletonIndex,
    expanded,
    selectedModule,
    modalOpen,
  } = state;

  const modulesRef = useRef(modules);
  useEffect(() => {
    modulesRef.current = modules;
  }, [modules]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const flat = flattenModules(modules);
  const topItems = flat.filter((f) => f.parentId === null);

  const skeletonPos =
    skeletonIndex !== null
      ? { parentId: skeletonParentId, index: skeletonIndex }
      : null;

  // ── Drag handlers ────────────────────────────────────────────────────────────

  function handleDragStart({ active }: DragStartEvent) {
    dispatch({ type: "DRAG_START", activeId: active.id });
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) {
      dispatch({ type: "DRAG_OVER_CLEAR" });
      return;
    }

    const currentFlat = flattenModules(modulesRef.current);
    const activeItem = currentFlat.find((f) => f.id === active.id);
    if (!activeItem) return;

    const overId = over.id;
    const overData = over.data.current as
      | { type?: string; parentId?: number }
      | undefined;

    if (overData?.type === "childZone" && overData.parentId != null) {
      if (activeItem.id === overData.parentId) {
        dispatch({ type: "DRAG_OVER_CLEAR" });
        return;
      }
      const parent = modulesRef.current.find((m) => m.id === overData.parentId);
      if (!parent) return;
      dispatch({
        type: "DRAG_OVER",
        parentId: overData.parentId,
        index: (parent.children ?? []).length,
      });
      return;
    }

    const overItem = currentFlat.find((f) => f.id === overId);
    if (!overItem) return;

    if (
      activeItem.depth === 0 &&
      overItem.depth === 0 &&
      activeItem.id !== overItem.id
    ) {
      dispatch({
        type: "DRAG_OVER",
        parentId: null,
        index: modulesRef.current.findIndex((m) => m.id === overId),
      });
      return;
    }

    if (activeItem.depth === 1 && overItem.depth === 1) {
      const parent = modulesRef.current.find((m) => m.id === overItem.parentId);
      if (!parent) return;
      dispatch({
        type: "DRAG_OVER",
        parentId: overItem.parentId ?? null,
        index: (parent.children ?? []).findIndex((c) => c.id === overId),
      });
      return;
    }

    if (activeItem.depth === 1 && overItem.depth === 0) {
      dispatch({
        type: "DRAG_OVER",
        parentId: null,
        index: modulesRef.current.findIndex((m) => m.id === overId),
      });
      return;
    }

    dispatch({ type: "DRAG_OVER_CLEAR" });
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    dispatch({ type: "DRAG_END" });

    if (!over || active.id === over.id) return;

    const currentFlat = flattenModules(modulesRef.current);
    const activeItem = currentFlat.find((f) => f.id === active.id);
    if (!activeItem) return;

    const overData = over.data.current as
      | { type?: string; parentId?: number }
      | undefined;
    const overId = over.id as number;

    let parentToExpand: number | null = null;
    if (overData?.type === "childZone" && overData.parentId != null) {
      parentToExpand = overData.parentId;
    }

    setModules((prev) => {
      // ── Drop into child zone ──
      if (overData?.type === "childZone" && overData.parentId != null) {
        const newParentId = overData.parentId;
        if (active.id === newParentId) return prev;
        const [extracted, cleaned] = extractModule(prev, active.id as number);
        if (!extracted) return prev;

        const orphans: ModuleType[] = extracted.children ?? [];
        const toInsert: ModuleType = { ...extracted, children: [] };
        const originalIndex = prev.findIndex((m) => m.id === extracted!.id);
        const withOrphans = [...cleaned];
        if (orphans.length > 0) {
          withOrphans.splice(
            Math.min(originalIndex, withOrphans.length),
            0,
            ...orphans,
          );
        }

        return reorder(
          withOrphans.map((item) =>
            item.id === newParentId
              ? {
                  ...item,
                  children: reorder([...(item.children ?? []), toInsert]),
                }
              : item,
          ),
        );
      }

      const overItem = currentFlat.find((f) => f.id === overId);
      if (!overItem) return prev;

      // ── Parent reorder ──
      if (activeItem.depth === 0 && overItem.depth === 0) {
        const ai = prev.findIndex((m) => m.id === active.id);
        const oi = prev.findIndex((m) => m.id === overId);
        return reorder(arrayMove(prev, ai, oi));
      }

      // ── Child reorder (same parent) ──
      if (
        activeItem.depth === 1 &&
        overItem.depth === 1 &&
        activeItem.parentId === overItem.parentId
      ) {
        return reorder(
          prev.map((item) => {
            if (item.id !== activeItem.parentId) return item;
            const children = item.children ?? [];
            const ai = children.findIndex((c) => c.id === active.id);
            const oi = children.findIndex((c) => c.id === overId);
            return { ...item, children: reorder(arrayMove(children, ai, oi)) };
          }),
        );
      }

      // ── Child → different parent ──
      if (
        activeItem.depth === 1 &&
        overItem.depth === 1 &&
        activeItem.parentId !== overItem.parentId
      ) {
        let moved: ModuleType | null = null;
        const step1 = prev.map((item) => {
          if (item.id !== activeItem.parentId) return item;
          const child = (item.children ?? []).find((c) => c.id === active.id);
          if (child) moved = child;
          return {
            ...item,
            children: reorder(
              (item.children ?? []).filter((c) => c.id !== active.id),
            ),
          };
        });
        if (!moved) return prev;
        return reorder(
          step1.map((item) => {
            if (item.id !== overItem.parentId) return item;
            const children = [...(item.children ?? [])];
            const oi = children.findIndex((c) => c.id === overId);
            children.splice(oi, 0, moved!);
            return { ...item, children: reorder(children) };
          }),
        );
      }

      // ── Child → promote to top-level ──
      if (activeItem.depth === 1 && overItem.depth === 0) {
        const [extracted, cleaned] = extractModule(prev, active.id as number);
        if (!extracted) return prev;
        const oi = cleaned.findIndex((m) => m.id === overId);
        const result = [...cleaned];
        result.splice(oi, 0, { ...extracted, children: [] });
        return reorder(result);
      }

      return prev;
    });

    if (parentToExpand !== null) {
      dispatch({ type: "EXPAND_ADD", id: parentToExpand });
    }
  }

  const onEditSuccess = (module: ModuleType) => {
    dispatch({ type: "MODAL_CLOSE" });
    setModules((prev) => prev.map((m) => (m.id === module.id ? module : m)));
  };

  const onDeleteSuccess = (id: number) => {
    dispatch({ type: "MODAL_CLOSE" });
    setModules((prev) => prev.filter((m) => m.id !== id));
  };

  const activeFlat = activeId ? flat.find((f) => f.id === activeId) : null;

  return (
    <div className="flex flex-col space-y-1 touch-none">
      <DndContext
        id="modules-dnd-context"
        sensors={sensors}
        collisionDetection={closestCenter}
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={topItems.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {topItems.flatMap((item, ti) => {
            const children = flat.filter((f) => f.parentId === item.id);
            const showSkeleton =
              skeletonPos?.parentId === null &&
              skeletonPos.index === ti &&
              activeId !== item.id;
            return [
              showSkeleton ? <SkeletonRow key={`top-skel-${ti}`} /> : null,
              <SortableParentModule
                key={item.id}
                module={item}
                childModules={children}
                skeletonPos={skeletonPos}
                activeId={activeId}
                isDragging={activeId === item.id}
                expanded={expanded.has(item.id)}
                onToggleExpand={(id) => dispatch({ type: "EXPAND_TOGGLE", id })}
                openModal={(id) => dispatch({ type: "MODAL_OPEN", id })}
                onDeleteSuccess={onDeleteSuccess}
              />,
            ].filter(Boolean);
          })}
          {skeletonPos?.parentId === null &&
            skeletonPos.index === topItems.length && <SkeletonRow />}
        </SortableContext>

        <DragOverlay dropAnimation={{ duration: 160, easing: "ease" }}>
          {activeFlat && (
            <DragCard module={activeFlat} isChild={activeFlat.depth === 1} />
          )}
        </DragOverlay>
      </DndContext>

      {selectedModule && (
        <EditModule
          open={modalOpen}
          onSuccess={onEditSuccess}
          onClose={() => dispatch({ type: "MODAL_CLOSE" })}
          id={selectedModule}
          modules={modules}
        />
      )}
    </div>
  );
};

export default Modules;
