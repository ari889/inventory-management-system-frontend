// ─── Drag Overlay Card ────────────────────────────────────────────────────────

import { FlatModule } from "@/@types/module.types";
import { MODULE_ROW_HEIGHT } from "./Module";

export default function DragCard({
  module,
  isChild,
}: {
  module: FlatModule;
  isChild: boolean;
}) {
  const isDivider = Boolean(module.data?.type);
  const name =
    module.data?.moduleName ?? module.data?.dividerTitle ?? "Untitled";

  return (
    <div
      className={[
        MODULE_ROW_HEIGHT,
        "flex items-stretch rounded-lg border border-gray-300 bg-white overflow-hidden cursor-grabbing ring-2 ring-gray-900/10",
        isChild ? "ml-10" : "",
      ].join(" ")}
      style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
    >
      {/* Grip — matches w-10 */}
      <div className="w-10 shrink-0 flex items-center justify-center bg-gray-100 border-r border-gray-200">
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          className="text-gray-400"
        >
          <circle cx="5.5" cy="4" r="1.2" fill="currentColor" />
          <circle cx="10.5" cy="4" r="1.2" fill="currentColor" />
          <circle cx="5.5" cy="8" r="1.2" fill="currentColor" />
          <circle cx="10.5" cy="8" r="1.2" fill="currentColor" />
          <circle cx="5.5" cy="12" r="1.2" fill="currentColor" />
          <circle cx="10.5" cy="12" r="1.2" fill="currentColor" />
        </svg>
      </div>
      {/* Chevron ghost */}
      {!isChild && (
        <div className="w-8 shrink-0 border-r border-gray-100 bg-gray-50/60" />
      )}
      {/* Content */}
      <div className="flex items-center gap-3 px-4 flex-1 min-w-0">
        <span className="font-semibold text-sm text-gray-900 truncate leading-none flex-1">
          {name}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {isDivider ? (
            <span className="inline-flex items-center h-5 rounded-md px-2 text-[10px] font-semibold bg-red-50 text-red-600 border border-red-200">
              Divider
            </span>
          ) : (
            <span className="inline-flex items-center h-5 rounded-md px-2 text-[10px] font-semibold bg-gray-900 text-white">
              Module
            </span>
          )}
          <span className="inline-flex items-center justify-center min-w-5.5 h-5 rounded-md bg-gray-100 border border-gray-200 text-[10px] font-bold text-gray-500 tabular-nums px-1">
            {module.order}
          </span>
        </div>
      </div>
      {/* Action ghost */}
      <div className="w-px my-2 bg-gray-200 shrink-0" />
      <div className="w-20 shrink-0" />
    </div>
  );
}
