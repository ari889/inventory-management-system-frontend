"use client";

import { Module as ModuleType } from "@/@types/module.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronRight, GripVertical, SquarePen } from "lucide-react";
import DeleteModuleButton from "./DeleteModuleButton";
import DynamicIcon from "@/components/common/DynamicIcon";
import { cn } from "@/lib/utils";

export const MODULE_ROW_HEIGHT = "h-[60px]";

interface ModuleProps {
  module: ModuleType;
  onDeleteSuccess: (id: number) => void;
  isChild?: boolean;
  order?: number;
  openModal?: (id: number) => void;
  dragHandleProps?: Record<string, unknown>;
  expanded?: boolean;
  onToggleExpand?: () => void;
  hasChildren?: boolean;
}

const Module = ({
  module,
  onDeleteSuccess,
  isChild = false,
  order,
  openModal,
  dragHandleProps,
  expanded = false,
  onToggleExpand,
  hasChildren = false,
}: ModuleProps) => {
  const isDivider = Boolean(module?.type);
  const name = module?.moduleName ?? module?.dividerTitle ?? "Untitled";

  return (
    <TooltipProvider delayDuration={400}>
      <div
        className={cn(
          MODULE_ROW_HEIGHT,
          "group flex items-stretch rounded-lg border bg-white overflow-hidden",
          "shadow-sm hover:shadow-md hover:border-gray-300",
          "transition-all duration-150",
          isChild ? "ml-10" : "",
        )}
      >
        {/* ── Grip ──────────────────────────────────────────────────────── */}
        <button
          type="button"
          {...dragHandleProps}
          className={cn(
            "flex items-center justify-center w-10 shrink-0 border-r",
            "bg-gray-50 hover:bg-gray-100 group-hover:bg-gray-100",
            "cursor-grab active:cursor-grabbing",
            "focus-visible:outline-none transition-colors",
          )}
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </button>
        {!isChild && (
          <button
            type="button"
            onClick={onToggleExpand}
            className={cn(
              "flex items-center justify-center w-8 shrink-0 border-r",
              "bg-gray-50/60 hover:bg-gray-100",
              "focus-visible:outline-none transition-colors",
              !hasChildren && "pointer-events-none opacity-30",
            )}
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            <ChevronRight
              className={cn(
                "w-3.5 h-3.5 text-gray-500 transition-transform duration-200",
                expanded && "rotate-90",
              )}
            />
          </button>
        )}

        <div className="flex items-center gap-3 px-4 flex-1 min-w-0">
          {module?.iconClass && (
            <span className="shrink-0 text-gray-500">
              <DynamicIcon name={module.iconClass} />
            </span>
          )}

          <span className="font-semibold text-sm text-gray-900 truncate leading-none flex-1">
            {name}
          </span>

          {module?.url && (
            <Badge
              variant="outline"
              className="hidden md:inline-flex shrink-0 font-mono text-[10px] h-5 text-gray-500 border-gray-200"
            >
              {module.url}
            </Badge>
          )}

          <div className="flex items-center gap-1.5 shrink-0">
            {isDivider ? (
              <Badge
                variant="destructive"
                className="h-5 text-[10px] px-2 font-semibold tracking-wide"
              >
                Divider
              </Badge>
            ) : (
              <Badge
                className={cn(
                  "h-5 text-[10px] px-2 font-semibold tracking-wide",
                  "bg-gray-900 text-white hover:bg-gray-800 border-transparent",
                )}
              >
                Module
              </Badge>
            )}

            {order !== undefined && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center justify-center min-w-5.5 h-5 rounded-md bg-gray-100 border border-gray-200 text-[10px] font-bold text-gray-500 tabular-nums px-1.5 cursor-default select-none">
                    {order}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  Order: {order}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        <Separator orientation="vertical" className="my-2 shrink-0" />
        <div className="flex items-center gap-1 px-2 shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2.5 gap-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => openModal?.(module?.id)}
              >
                <SquarePen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-medium">Edit</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              Edit module
            </TooltipContent>
          </Tooltip>
          <DeleteModuleButton
            id={module?.id}
            menuId={module?.menuId}
            onDeleteSuccess={onDeleteSuccess}
          />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Module;
