"use client";
import { Unit } from "@/@types/unit.types";
import { createUnit } from "@/actions/UnitAction";
import UnitAutocomplete from "@/components/common/autocompletes/UnitAutocomplete";
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
import { unitSchema, UnitSchemaType } from "@/schemas/unit.schema";
import { setApiErrors } from "@/utils/setFormErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const CreateUnitForm = ({ onSuccess }: { onSuccess: (data: Unit) => void }) => {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const {
    control,
    handleSubmit,
    setError: setFormError,
  } = useForm<UnitSchemaType>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      unitCode: "",
      unitName: "",
      baseUnitId: null,
      operator: "",
      operationValue: 0,
      status: true,
    },
  });

  const onSubmit = (data: UnitSchemaType) =>
    startTransition(async () => {
      try {
        const response = await createUnit(data);

        if (!response.success && response?.errors)
          setApiErrors(response.errors, setFormError);
        else if (!response.success)
          throw new Error(response?.message || "Failed to create unit");
        else {
          onSuccess(response?.data);
          toast.success("Unit created successfully");
        }
      } catch (error) {
        if (error instanceof Error) setError(error?.message);
        else setError("Something went wrong");
      }
    });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <Alert variant="destructive" className="mb-4">
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
          name="unitCode"
          label="Unit Code"
          placeholder="Eg: KGM"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="unitName"
          label="Unit Name"
          placeholder="Eg: Kilogram"
          disabled={isPending}
        />
        <UnitAutocomplete
          control={control}
          name="baseUnitId"
          label="Base Unit"
        />
        <FormInput
          control={control}
          name="operator"
          label="Unit Operator"
          placeholder="Eg: *, /"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="operationValue"
          label="Operation Value"
          placeholder="Eg: 2.5"
          type="number"
          min={0}
          disabled={isPending}
        />
        <CustomSelect
          control={control}
          name="status"
          label="Status"
          disabled={isPending}
          data={[
            { value: true, label: "Active" },
            { value: false, label: "Inactive" },
          ]}
        />
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

export default CreateUnitForm;
