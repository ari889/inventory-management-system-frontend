"use client";
import { Module } from "@/@types/module.types";
import { Permission } from "@/@types/permission.types";
import { getModules } from "@/actions/ModuleAction";
import { createPermission } from "@/actions/PermissionAction";
import CustomSelect, {
  SelectGroupOption,
} from "@/components/common/CustomSelect";
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
  PermissionSchema,
  PermissionSchemaType,
} from "@/schemas/permission.schema";
import { stringToSlug } from "@/utils/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { useEffect, useEffectEvent, useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

const CreatePermission = ({
  onSuccess,
}: {
  onSuccess: (data: Permission) => void;
}) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const { control, handleSubmit, setValue, watch } =
    useForm<PermissionSchemaType>({
      defaultValues: {
        moduleId: null,
        permissions: [
          {
            name: "",
            slug: "",
            deletable: true,
          },
        ],
      },
      resolver: zodResolver(PermissionSchema),
    });

  /**
   * auto generate slug
   */
  useEffect(() => {
    const subscription = watch((value) => {
      value?.permissions?.forEach((item, index) => {
        const slug = stringToSlug(item.name || "");
        if (item.slug !== slug) {
          setValue(`permissions.${index}.slug`, slug);
        }
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  /**
   * fetch module function
   */
  const fetchModules = useEffectEvent(async () => {
    try {
      const response = await getModules();

      if (!response?.success) throw new Error(response?.message);

      setModules(response?.data);
    } catch (error) {
      if (error instanceof Error) setError(error?.message);
      else setError("Something went wrong");
    }
  });

  /**
   * fetch module by effect
   */
  useEffect(() => {
    let mount = true;

    if (mount) fetchModules();

    return () => {
      mount = false;
    };
  }, []);

  /**
   * use field array for permissions
   */
  const { fields, append, remove } = useFieldArray({
    control,
    name: "permissions",
  });

  const onSubmit = (data: PermissionSchemaType) =>
    startTransition(async () => {
      try {
        const response = await createPermission(data);

        if (!response?.success) throw new Error(response?.message);

        toast.success(response?.message);
        onSuccess(response?.data);
      } catch (error) {
        if (error instanceof Error) setError(error?.message);
        else setError("Something went wrong");
      }
    });

  /**
   * get module groups
   */
  const moduleGroups = modules.reduce<SelectGroupOption[]>((acc, module) => {
    if (module.type && module.dividerTitle) {
      acc.push({
        label: module.dividerTitle,
        options: [],
      });
      return acc;
    }

    if (!module.type && module.moduleName) {
      if (acc.length === 0) {
        acc.push({
          label: "General",
          options: [],
        });
      }

      acc[acc.length - 1].options.push({
        value: module.id,
        label: module.moduleName,
      });
    }

    return acc;
  }, []);

  /**
   * add separator
   */
  const groupsWithSeparator = moduleGroups.map((group, index) => ({
    ...group,
    separator: index !== moduleGroups.length - 1,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <AlertAction>
            <Button size="xs" variant="default" onClick={() => setError("")}>
              Close
            </Button>
          </AlertAction>
        </Alert>
      )}
      <FieldGroup>
        <CustomSelect
          control={control}
          name="moduleId"
          label="Module"
          disabled={isPending}
          groups={groupsWithSeparator}
        />
        {fields.map((fieldItem, index) => (
          <div key={fieldItem.id} className="grid grid-cols-4 gap-4 items-end">
            <FormInput
              control={control}
              name={`permissions.${index}.name`}
              label="Permission Name"
              placeholder="Enter permission name"
              disabled={isPending}
            />

            <FormInput
              control={control}
              name={`permissions.${index}.slug`}
              label="Slug"
              placeholder="Enter permission slug"
              disabled={true}
            />

            <CustomSelect
              control={control}
              name={`permissions.${index}.deletable`}
              label="Deletable"
              disabled={isPending}
              data={[
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
            />
            {index === fields.length - 1 ? (
              <Button
                type="button"
                variant="default"
                onClick={() => append({ name: "", slug: "", deletable: true })}
                disabled={isPending}
              >
                Add
              </Button>
            ) : (
              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(index)}
                disabled={isPending}
              >
                Remove
              </Button>
            )}
          </div>
        ))}

        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Spinner data-icon="inline-start" /> : ""}
            Create New
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default CreatePermission;
