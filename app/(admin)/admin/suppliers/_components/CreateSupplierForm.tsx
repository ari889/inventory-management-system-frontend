"use client";
import { Supplier } from "@/@types/supplier.types";
import { createSupplier } from "@/actions/SupplierAcrion";
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
import { supplierSchema, SupplierSchemaType } from "@/schemas/supplier.schema";
import { setApiErrors } from "@/utils/setFormErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const CreateSupplierForm = ({
  onSuccess,
}: {
  onSuccess: (data: Supplier) => void;
}) => {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const {
    control,
    handleSubmit,
    setError: setFormError,
  } = useForm<SupplierSchemaType>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      companyName: "",
      vatNumber: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      status: true,
    },
  });

  const onSubmit = (data: SupplierSchemaType) =>
    startTransition(async () => {
      try {
        const response = await createSupplier(data);

        if (!response.success && response?.errors)
          setApiErrors(response.errors, setFormError);
        else if (!response.success)
          throw new Error(response?.message || "Failed to create supplier");
        else {
          onSuccess(response?.data);
          toast.success("Supplier created successfully");
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
          label="Supplier Name"
          placeholder="Enter a valid supplier name"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="companyName"
          label="Company Name"
          placeholder="Enter a valid company name"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="vatNumber"
          label="Vat Number"
          placeholder="Enter a valid vat number"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="email"
          label="Email"
          placeholder="Enter a valid supplier email"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="phone"
          label="Phone"
          placeholder="Enter a valid supplier phone"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="address"
          label="Address"
          placeholder="Enter a valid supplier address"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="city"
          label="City"
          placeholder="Enter a valid city"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="state"
          label="State"
          placeholder="Enter a valid state"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="postalCode"
          label="Postal Code"
          placeholder="Enter a valid postal code"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="country"
          label="Country"
          placeholder="Enter a valid country"
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

export default CreateSupplierForm;
