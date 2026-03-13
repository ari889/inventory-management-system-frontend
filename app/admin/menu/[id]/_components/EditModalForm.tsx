"use client";

import { Module } from "@/@types/module.types";
import { updateModule } from "@/actions/ModuleAction";
import CustomSelect from "@/components/common/CustomSelect";
import FormInput from "@/components/common/FormInput";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import {
  createModuleSchema,
  CreateModuleSchemaType,
} from "@/schemas/module.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

const EditModuleForm = ({
  modules,
  id,
  module,
  onSuccess,
}: {
  modules: Module[];
  id: number;
  module: Module;
  onSuccess: () => void;
}) => {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const { control, handleSubmit, watch } = useForm<CreateModuleSchemaType>({
    resolver: zodResolver(createModuleSchema),
    shouldUnregister: true,
    defaultValues: {
      type: module?.type,
      moduleName: module?.moduleName ?? "",
      dividerTitle: module?.dividerTitle ?? "",
      iconClass: module.iconClass ?? "",
      url: module?.url ?? "",
      order: module?.order,
      parentId: module?.parentId,
      target: module?.target === "SELF" ? "_self" : "_blank",
      deletable: module?.deletable,
    },
  });

  const type = watch("type");

  const onSubmit = (data: CreateModuleSchemaType) =>
    startTransition(async () => {
      try {
        const response = await updateModule(id, module?.menuId, data);

        if (!response.success) throw new Error(response.message);
        console.log(response);
        onSuccess();
      } catch (error) {
        if (error instanceof Error) setError(error?.message);
        else setError("Something went wrong");
      }
    });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <Alert variant="destructive" className="max-w-md">
          <AlertCircleIcon />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>

          <AlertAction>
            <Button size="xs" onClick={() => setError("")}>
              Close
            </Button>
          </AlertAction>
        </Alert>
      )}

      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <CustomSelect
            control={control}
            name="type"
            label="Module Type"
            disabled={isPending}
            data={[
              { value: true, label: "Divider" },
              { value: false, label: "Module" },
            ]}
          />

          {/* MODULE FIELDS */}
          {!type && (
            <>
              <FormInput
                control={control}
                name="moduleName"
                label="Module Name"
                placeholder="Enter a valid module name"
                disabled={isPending}
              />

              <FormInput
                control={control}
                name="iconClass"
                label="Icon Name"
                placeholder="Enter a valid icon name from lucide react"
                disabled={isPending}
              />

              <FormInput
                control={control}
                name="url"
                label="Valid URL"
                placeholder="Enter a valid url for module"
                disabled={isPending}
              />

              <CustomSelect
                control={control}
                name="parentId"
                label="Parent"
                disabled={isPending}
                data={modules
                  ?.filter((module) => module?.type === false)
                  .map((module) => ({
                    value: Number(module?.id),
                    label: module?.moduleName as string,
                  }))}
              />
            </>
          )}

          {/* DIVIDER FIELD */}
          {type && (
            <FormInput
              control={control}
              name="dividerTitle"
              label="Divider Title"
              placeholder="Enter a valid divider title"
              disabled={isPending}
            />
          )}

          {/* COMMON FIELDS */}
          <FormInput
            control={control}
            type="number"
            name="order"
            label="Module Order"
            placeholder="Enter module order"
            disabled={isPending}
          />

          <CustomSelect
            control={control}
            name="target"
            label="Target"
            disabled={isPending}
            data={[
              { value: "_self", label: "Self" },
              { value: "_blank", label: "Blank" },
            ]}
          />

          <div className={type ? "col-span-2" : "col-span-1"}>
            <CustomSelect
              control={control}
              name="deletable"
              label="Deletable"
              disabled={isPending}
              data={[
                { value: true, label: "Yes" },
                { value: false, label: "No" },
              ]}
            />
          </div>
        </div>

        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending && <Spinner data-icon="inline-start" />}
            Update
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default EditModuleForm;
