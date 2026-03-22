"use client";
import { Permission } from "@/@types/permission.types";
import { updatePermission } from "@/actions/PermissionAction";
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
  PermissionItemSchema,
  PermissionItemSchemaType,
} from "@/schemas/permission.schema";
import { stringToSlug } from "@/utils/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const EditPermissionForm = ({
  permission,
  onSuccess,
}: {
  permission: Permission;
  onSuccess: (data: Permission) => void;
}) => {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const { control, handleSubmit, setValue, watch } =
    useForm<PermissionItemSchemaType>({
      defaultValues: {
        name: permission?.name,
        slug: permission?.slug,
        deletable: permission?.deletable,
      },
      resolver: zodResolver(PermissionItemSchema),
    });

  /**
   * auto generate slug
   */
  const name = watch("name");

  useEffect(() => {
    if (name && name.trim() !== "") {
      const slug = stringToSlug(name);
      setValue("slug", slug, { shouldValidate: true });
    }
  }, [name, setValue]);

  const onSubmit = (data: PermissionItemSchemaType) =>
    startTransition(async () => {
      try {
        const response = await updatePermission(permission.id, data);

        if (!response?.success) throw new Error(response?.message);

        toast.success(response?.message);
        onSuccess(response?.data);
      } catch (error) {
        if (error instanceof Error) setError(error?.message);
        else setError("Something went wrong");
      }
    });

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
        <FormInput
          control={control}
          name="name"
          label="Permission Name"
          placeholder="Enter permission name"
          disabled={isPending}
        />

        <FormInput
          control={control}
          name="slug"
          label="Slug"
          placeholder="Enter permission slug"
          disabled={true}
        />

        <CustomSelect
          control={control}
          name="deletable"
          label="Deletable"
          disabled={isPending}
          data={[
            { value: "true", label: "Yes" },
            { value: "false", label: "No" },
          ]}
        />

        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Spinner data-icon="inline-start" /> : "Update"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default EditPermissionForm;
