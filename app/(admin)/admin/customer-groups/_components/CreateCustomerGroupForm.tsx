"use client";
import { CustomerGroup } from "@/@types/customer-group.types";
import { createCustomerGroup } from "@/actions/CustomerGroupAction";
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
  CustomerGroupSchema,
  CustomerGroupSchemaType,
} from "@/schemas/customer-group.schema";
import { setApiErrors } from "@/utils/setFormErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const CreateCustomerGroupForm = ({
  onSuccess,
}: {
  onSuccess: (data: CustomerGroup) => void;
}) => {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const {
    control,
    handleSubmit,
    setError: setFormError,
  } = useForm<CustomerGroupSchemaType>({
    resolver: zodResolver(CustomerGroupSchema),
    defaultValues: {
      groupName: "",
      percentage: 0,
      status: true,
    },
  });

  const onSubmit = (data: CustomerGroupSchemaType) =>
    startTransition(async () => {
      try {
        const response = await createCustomerGroup(data);

        if (!response.success && response?.errors)
          setApiErrors(response.errors, setFormError);
        else if (!response.success)
          throw new Error(
            response?.message || "Failed to create customer group",
          );
        else {
          onSuccess(response?.data);
          toast.success("Customer group created successfully");
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
          name="groupName"
          label="Customer Group Name"
          placeholder="Enter a valid customer group name"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="percentage"
          label="Percentage (%)"
          type="number"
          min={0}
          max={100}
          placeholder="Enter a valid percentage"
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

export default CreateCustomerGroupForm;
