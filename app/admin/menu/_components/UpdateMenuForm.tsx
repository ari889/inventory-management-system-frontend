"use client";
import { Menu } from "@/@types/menu.types";
import { updateMenu } from "@/actions/MenuAction";
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
import { createMenuSchema } from "@/schemas/create-menu.schema";
import type { CreateMenuSchemaType } from "@/schemas/create-menu.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

const UpdateMenuForm = ({
  data,
  onSuccess,
}: {
  data: Menu;
  onSuccess: (data: Menu) => void;
}) => {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const { control, handleSubmit } = useForm<CreateMenuSchemaType>({
    defaultValues: {
      menuName: data?.menuName,
      deletable: data?.deletable,
    },
    resolver: zodResolver(createMenuSchema),
  });

  const onSubmit = (formData: CreateMenuSchemaType) =>
    startTransition(async () => {
      try {
        const response = await updateMenu(data.id, formData);

        if (!response.success) throw new Error(response.message);
        onSuccess(response?.data);
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
            <Button size="xs" variant="default" onClick={() => setError("")}>
              Close
            </Button>
          </AlertAction>
        </Alert>
      )}
      <FieldGroup>
        <FormInput
          control={control}
          name="menuName"
          label="Menu Name"
          placeholder="Enter a valid menu name!"
          disabled={isPending}
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
            {isPending ? <Spinner data-icon="inline-start" /> : ""}
            Update
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default UpdateMenuForm;
