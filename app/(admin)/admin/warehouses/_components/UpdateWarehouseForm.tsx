"use client";
import { User } from "@/@types/user.types";
import { Warehouse } from "@/@types/warehouse.types";
import { updateUser } from "@/actions/UserAction";
import { updateWarehouse } from "@/actions/WarehouseAction";
import RoleAutocomplete from "@/components/common/autocompletes/RoleAutocomplete";
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

const UpdateWarehouseForm = ({
  data,
  onSuccess,
}: {
  data: Warehouse;
  onSuccess: (data: Warehouse) => void;
}) => {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const {
    control,
    handleSubmit,
    setError: setFormError,
  } = useForm<WarehouseSchemaType>({
    defaultValues: {
      name: data?.name || "",
      email: data?.email || null,
      phone: data?.phone || null,
      address: data?.address || null,
      status: data?.status || true,
    },
    resolver: zodResolver(warehouseSchema),
  });

  const onSubmit = (formData: WarehouseSchemaType) =>
    startTransition(async () => {
      try {
        const response = await updateWarehouse(data.id, formData);

        if (!response.success && response?.errors)
          setApiErrors(response.errors, setFormError);
        else if (!response.success)
          throw new Error(response?.message || "Failed to update warehouse");
        else {
          onSuccess(response?.data);
          toast.success("Warehouse updated successfully");
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
          placeholder="Enter a valid address"
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
        <div className="col-span-2">
          <Field>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner data-icon="inline-start" /> : ""}
              Update
            </Button>
          </Field>
        </div>
      </FieldGroup>
    </form>
  );
};

export default UpdateWarehouseForm;
