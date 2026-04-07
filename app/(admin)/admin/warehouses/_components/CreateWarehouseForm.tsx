"use client";
import { Warehouse } from "@/@types/warehouse.types";
import { createWarehouse } from "@/actions/WarehouseAction";
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
  warehouseSchema,
  WarehouseSchemaType,
} from "@/schemas/warehouse.schema";
import { setApiErrors } from "@/utils/setFormErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const CreateWarehouseForm = ({
  onSuccess,
}: {
  onSuccess: (data: Warehouse) => void;
}) => {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const {
    control,
    handleSubmit,
    setError: setFormError,
  } = useForm<WarehouseSchemaType>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      name: "",
      email: null,
      phone: null,
      address: null,
      status: true,
    },
  });

  const onSubmit = (data: WarehouseSchemaType) =>
    startTransition(async () => {
      try {
        const response = await createWarehouse(data);

        if (!response.success && response?.errors)
          setApiErrors(response.errors, setFormError);
        else if (!response.success)
          throw new Error(response?.message || "Failed to create warehouse");
        else {
          onSuccess(response?.data);
          toast.success("Warehouse created successfully");
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
          name="name"
          label="Warehouse Name"
          placeholder="Enter a valid warehouse name"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="email"
          label="Warehouse Email"
          placeholder="Enter a valid warehouse email"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="phone"
          label="Phone Number"
          placeholder="Enter a valid phone number"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="address"
          label="Address"
          placeholder="Enter the warehouse address"
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

export default CreateWarehouseForm;
