"use client";
import { Customer } from "@/@types/customer.types";
import { createCustomer } from "@/actions/CustomerAction";
import CustomerGroupAutocomplete from "@/components/common/autocompletes/CustomerGroupAutoComplete";
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
import { customerSchema, CustomerSchemaType } from "@/schemas/customer.schema";
import { setApiErrors } from "@/utils/setFormErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const CreateCustomerForm = ({
  onSuccess,
}: {
  onSuccess: (customer: Customer) => void;
}) => {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const {
    control,
    handleSubmit,
    setError: setFormError,
  } = useForm<CustomerSchemaType>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      customerGroupId: undefined,
      name: "",
      companyName: "",
      taxNumber: "",
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

  const onSubmit = (data: CustomerSchemaType) =>
    startTransition(async () => {
      try {
        const response = await createCustomer(data);

        if (!response.success && response?.errors)
          setApiErrors(response.errors, setFormError);
        else if (!response.success)
          throw new Error(response?.message || "Failed to create customer");
        else {
          onSuccess(response?.data);
          toast.success("Customer created successfully");
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
        <CustomerGroupAutocomplete
          control={control}
          name="customerGroupId"
          label="Customer Group"
        />
        <FormInput
          control={control}
          name="name"
          label="Customer Name"
          placeholder="Enter a valid Customer name"
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
          name="taxNumber"
          label="Vat Number"
          placeholder="Enter a valid vat number"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="email"
          label="Email"
          placeholder="Enter a valid customer email"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="phone"
          label="Phone"
          placeholder="Enter a valid customer phone"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="address"
          label="Address"
          placeholder="Enter a valid Customer address"
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

export default CreateCustomerForm;
