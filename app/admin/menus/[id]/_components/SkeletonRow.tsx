// ─── Skeleton Row ─────────────────────────────────────────────────────────────

import { MODULE_ROW_HEIGHT } from "./Module";

export default function SkeletonRow({
  isChild = false,
}: {
  isChild?: boolean;
}) {
  return (
    <div
      className={[
        MODULE_ROW_HEIGHT,
        "flex items-stretch rounded-lg border border-dashed border-gray-300 bg-gray-50 overflow-hidden animate-pulse",
        isChild ? "ml-10" : "",
      ].join(" ")}
    >
      {/* Grip — matches w-10 in Module */}
      <div className="w-10 shrink-0 bg-gray-100 border-r border-gray-200" />
      {/* Chevron — only for parent rows */}
      {!isChild && (
        <div className="w-8 shrink-0 bg-gray-50 border-r border-gray-200" />
      )}
      {/* Content */}
      <div className="flex items-center gap-3 px-4 flex-1 min-w-0">
        <div className="h-2.5 flex-1 rounded-full bg-gray-200 max-w-40" />
        <div className="flex items-center gap-1.5 ml-auto shrink-0">
          <div className="h-5 w-14 rounded-md bg-gray-200" />
          <div className="h-5 w-6 rounded-md bg-gray-100" />
        </div>
      </div>
      {/* Actions */}
      <div className="w-px my-2 bg-gray-200 shrink-0" />
      <div className="flex items-center gap-1 px-2 shrink-0">
        <div className="h-7 w-16 rounded-md bg-gray-100" />
        <div className="h-7 w-7 rounded-md bg-gray-100" />
      </div>
    </div>
  );
}
