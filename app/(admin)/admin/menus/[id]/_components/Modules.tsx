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
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import {
  Module,
  ModulesState,
  Module as ModuleType,
} from "@/@types/module.types";
import EditModule from "./EditModule";
import { computeNextModules, flattenModules } from "@/utils/common";
import SkeletonRow from "./SkeletonRow";
import SortableParentModule from "./SortableParentModule";
import DragCard from "./DragCard";
import { updateModuleRecorder } from "@/actions/ModuleAction";
import { toast } from "sonner";

/**
 * module types
 */
type ModulesAction =
  | { type: "DRAG_START"; activeId: UniqueIdentifier }
  | { type: "DRAG_OVER"; parentId: UniqueIdentifier | null; index: number }
  | { type: "DRAG_OVER_CLEAR" }
  | { type: "DRAG_END" }
  | { type: "EXPAND_TOGGLE"; id: number }
  | { type: "EXPAND_ADD"; id: number }
  | { type: "MODAL_OPEN"; id: number }
  | { type: "MODAL_CLOSE" };

/**
 * initial state
 */
const initialState: ModulesState = {
  activeId: null,
  skeletonParentId: null,
  skeletonIndex: null,
  expanded: new Set(),
  selectedModule: null,
  modalOpen: false,
};

/**
 * Reducer function
 * @param state
 * @param action
 * @returns state
 */
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

const Modules = ({
  modules,
  setModules,
  menuId,
}: {
  modules: ModuleType[];
  setModules: React.Dispatch<React.SetStateAction<ModuleType[]>>;
  menuId: number;
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

  /**
   * modules ref
   */
  const modulesRef = useRef(modules);
  useEffect(() => {
    modulesRef.current = modules;
  }, [modules]);

  /**
   * drag sensors
   */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  /**
   * flat modules
   */
  const flat = flattenModules(modules);
  const topItems = flat.filter((f) => f.parentId === null);

  /**
   * skeleton position
   */
  const skeletonPos =
    skeletonIndex !== null
      ? { parentId: skeletonParentId, index: skeletonIndex }
      : null;

  /**
   * On drag start
   * @param param0
   */
  function handleDragStart({ active }: DragStartEvent) {
    dispatch({ type: "DRAG_START", activeId: active.id });
  }

  /**
   * On drag over
   * @param param0
   * @returns
   */
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

  const updateModuleRecorderAction = async (items: Module[]) => {
    try {
      const response = await updateModuleRecorder(menuId, items);
      if (!response?.success) throw new Error(response?.message);
      toast.success(response?.message);
    } catch (error) {
      if (error instanceof Error) toast.error(error?.message);
      else toast.error("Something went wrong");
    }
  };

  /**
   * On Drag end
   * @param param0
   * @returns
   */
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

    const nextModules = computeNextModules(
      modulesRef.current,
      currentFlat,
      active,
      over,
      overData,
      overId,
      activeItem,
    );

    setModules(nextModules);

    updateModuleRecorderAction(nextModules);

    if (parentToExpand !== null) {
      dispatch({ type: "EXPAND_ADD", id: parentToExpand });
    }
  }

  /**
   * On Edit success
   * @param module
   */
  const onEditSuccess = (module: ModuleType) => {
    dispatch({ type: "MODAL_CLOSE" });
    setModules((prev) => {
      const existsAtRoot = prev.some((item) => item.id === module.id);
      const currentParent = prev.find((item) =>
        item.children?.some((c) => c.id === module.id),
      );
      if (existsAtRoot) {
        return prev.map((item) => (item.id === module.id ? module : item));
      }
      if (currentParent?.id === module.parentId) {
        return prev.map((item) => {
          if (item.id !== currentParent.id) return item;
          return {
            ...item,
            children: item.children?.map((c) =>
              c.id === module.id ? module : c,
            ),
          };
        });
      }
      if (currentParent) {
        return prev.map((item) => {
          if (item.id === currentParent.id) {
            return {
              ...item,
              children: item.children?.filter((c) => c.id !== module.id),
            };
          }
          if (item.id === module.parentId) {
            return {
              ...item,
              children: [...(item.children ?? []), module],
            };
          }
          return item;
        });
      }

      return prev;
    });
  };

  /**
   * On delete success
   * @param id
   */
  const onDeleteSuccess = (id: number) => {
    dispatch({ type: "MODAL_CLOSE" });
    setModules((prev) =>
      prev
        .filter((item) => item.id !== id)
        .map((item) => ({
          ...item,
          children: item.children?.filter((c) => c.id !== id) ?? [],
        })),
    );
  };

  /**
   * Get active item
   */
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
