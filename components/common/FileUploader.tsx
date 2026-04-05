"use client";

import { useCallback } from "react";
import { useDropzone, Accept } from "react-dropzone";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  FileText,
  FileSpreadsheet,
  FileCode,
  FileArchive,
  FileAudio,
  FileVideo,
  File,
  ImageIcon,
  X,
  UploadCloud,
} from "lucide-react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

// ─── MIME → Accept map ────────────────────────────────────────────────────────
const buildAccept = (types: string[]): Accept =>
  types.reduce<Accept>((acc, t) => ({ ...acc, [t]: [] }), {});

// ─── Lucide icon picker ───────────────────────────────────────────────────────
const FileIcon = ({
  mime,
  className,
}: {
  mime: string;
  className?: string;
}) => {
  const cls = cn("h-10 w-10", className);
  if (mime.startsWith("image/")) return <ImageIcon className={cls} />;
  if (mime.startsWith("audio/")) return <FileAudio className={cls} />;
  if (mime.startsWith("video/")) return <FileVideo className={cls} />;
  if (mime.includes("pdf")) return <FileText className={cls} />;
  if (mime.includes("sheet") || mime.includes("excel") || mime.includes("csv"))
    return <FileSpreadsheet className={cls} />;
  if (mime.includes("zip") || mime.includes("tar") || mime.includes("rar"))
    return <FileArchive className={cls} />;
  if (mime.includes("json") || mime.includes("xml") || mime.includes("html"))
    return <FileCode className={cls} />;
  return <File className={cls} />;
};

// ─── Inner dropzone — hooks live here, not inside a render prop ───────────────
type DropzoneInnerProps = {
  value: File | undefined;
  onChange: (file: File | undefined) => void;
  acceptTypes: string[];
  placeholder: string;
  disabled: boolean;
  invalid: boolean;
  errorMessage?: string;
};

function DropzoneInner({
  value,
  onChange,
  acceptTypes,
  placeholder,
  disabled,
  invalid,
  errorMessage,
}: DropzoneInnerProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) onChange(accepted[0]);
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: buildAccept(acceptTypes),
      disabled,
      multiple: false,
      maxFiles: 1,
    });

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  const isImage = value?.type.startsWith("image/");

  return (
    <>
      <div
        {...getRootProps()}
        className={cn(
          "relative flex min-h-[160px] w-full cursor-pointer flex-col items-center justify-center",
          "rounded-lg border-2 border-dashed transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",

          // idle
          !disabled &&
            !isDragActive &&
            !isDragReject &&
            !invalid &&
            "border-border bg-muted/30 hover:border-primary/60 hover:bg-muted/60",

          // drag valid
          isDragActive &&
            !isDragReject &&
            "border-primary bg-primary/5 scale-[1.01]",

          // drag rejected type
          isDragReject && "border-destructive bg-destructive/5",

          // validation error
          invalid && !isDragActive && "border-destructive bg-destructive/5",

          // disabled
          disabled && "cursor-not-allowed border-muted bg-muted/20 opacity-60",
        )}
      >
        <input {...getInputProps()} />

        {value ? (
          /* ── File selected ── */
          <div className="flex w-full flex-col items-center gap-3 px-6 py-4">
            {isImage ? (
              <div className="relative w-full max-h-[180px] overflow-hidden rounded-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(value)}
                  alt={value.name}
                  className="mx-auto max-h-[180px] w-auto object-contain rounded-md"
                />
              </div>
            ) : (
              <FileIcon mime={value.type} className="text-muted-foreground" />
            )}

            <div className="flex w-full items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {value.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(value.size / 1024).toFixed(1)} KB &middot;{" "}
                  {value.type || "unknown type"}
                </p>
              </div>

              {!disabled && (
                <button
                  type="button"
                  onClick={clear}
                  className={cn(
                    "flex-shrink-0 rounded-full p-1",
                    "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
                    "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  )}
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* ── Empty drop zone ── */
          <div className="flex flex-col items-center gap-2 px-6 py-8 text-center">
            <UploadCloud
              className={cn(
                "h-10 w-10 transition-colors",
                isDragReject && "text-destructive",
                isDragActive && !isDragReject && "text-primary",
                !isDragActive && !isDragReject && "text-muted-foreground",
                disabled && "text-muted-foreground/50",
              )}
            />

            <p
              className={cn(
                "text-sm font-medium",
                isDragReject
                  ? "text-destructive"
                  : isDragActive
                    ? "text-primary"
                    : disabled
                      ? "text-muted-foreground/50"
                      : "text-muted-foreground",
              )}
            >
              {isDragReject
                ? "File type not accepted"
                : isDragActive
                  ? "Drop it here!"
                  : placeholder}
            </p>

            <p
              className={cn(
                "text-xs",
                disabled
                  ? "text-muted-foreground/40"
                  : "text-muted-foreground/70",
              )}
            >
              {acceptTypes
                .map((t) => t.split("/")[1]?.toUpperCase() ?? t)
                .join(", ")}
            </p>
          </div>
        )}
      </div>

      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </>
  );
}

// ─── Public component — only Controller lives here ────────────────────────────
type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  acceptTypes: string[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
};

export default function FileUploader<T extends FieldValues>({
  control,
  name,
  acceptTypes,
  label,
  placeholder = "Drag & drop a file here, or click to browse",
  disabled = false,
}: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel>{label}</FieldLabel>}

          <DropzoneInner
            value={field.value}
            onChange={field.onChange}
            acceptTypes={acceptTypes}
            placeholder={placeholder}
            disabled={disabled}
            invalid={fieldState.invalid}
            errorMessage={fieldState.error?.message}
          />
        </Field>
      )}
    />
  );
}
