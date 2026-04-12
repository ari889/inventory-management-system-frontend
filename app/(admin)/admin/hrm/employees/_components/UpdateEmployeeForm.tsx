"use client";
import { Employee } from "@/@types/employee.types";
import { updateEmployee } from "@/actions/EmployeeAction";
import DepartmentAutocomplete from "@/components/common/autocompletes/DepartmentAutocomplete";
import CustomSelect from "@/components/common/CustomSelect";
import FileUploader from "@/components/common/FileUploader";
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
import { employeeSchema, EmployeeSchemaType } from "@/schemas/employee.schema";
import { setApiErrors } from "@/utils/setFormErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const UpdateEmployeeForm = ({
  data,
  onSuccess,
}: {
  data: Employee;
  onSuccess: (data: Employee) => void;
}) => {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const {
    control,
    handleSubmit,
    setError: setFormError,
  } = useForm<EmployeeSchemaType>({
    defaultValues: {
      name: data?.name || "",
      image: data?.image || null,
      phone: data?.phone || "",
      address: data?.address || "",
      city: data?.city || "",
      state: data?.state || "",
      zip: data?.zip || "",
      postalCode: data?.postalCode || null,
      country: data?.country || "",
      departmentId: data?.department?.id || undefined,
      status: data?.status || false,
    },
    resolver: zodResolver(employeeSchema),
  });

  const onSubmit = (payload: EmployeeSchemaType) =>
    startTransition(async () => {
      try {
        const body = new FormData();
        body.append("name", payload.name);
        body.append("phone", payload.phone);
        body.append("address", payload.address);
        body.append("city", payload.city);
        body.append("state", payload.state);
        body.append("zip", payload.zip);
        body.append("postalCode", payload.postalCode || "");
        body.append("country", payload.country);
        body.append("departmentId", String(payload.departmentId));
        body.append("status", String(payload.status));

        if (payload.image instanceof File) {
          body.append("image", payload.image as File, payload.image.name);
        }
        const response = await updateEmployee(data.id, body);

        if (!response.success && response?.errors)
          setApiErrors(response.errors, setFormError);
        else if (!response.success)
          throw new Error(response?.message || "Failed to update department");
        else {
          onSuccess(response?.data);
          toast.success("Department updated successfully");
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
          label="Employee Name"
          placeholder="Eg: John Doe"
          disabled={isPending}
        />
        <FileUploader
          control={control}
          name="image"
          label="Employee Image"
          acceptTypes={["image/jpeg", "image/png", "image/gif"]}
          placeholder="Upload your employee image"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="phone"
          label="Phone Number"
          placeholder="Eg: +1 (123) 456-7890"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="address"
          label="Address"
          placeholder="Eg: 123 Main Street"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="city"
          label="City"
          placeholder="Eg: New York"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="state"
          label="State"
          placeholder="Eg: New York"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="zip"
          label="Zip Code"
          placeholder="Eg: 12345"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="postalCode"
          label="Postal Code"
          placeholder="Eg: 12345"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="country"
          label="Country"
          placeholder="Eg: United States"
          disabled={isPending}
        />
        <DepartmentAutocomplete
          control={control}
          name="departmentId"
          label="Department"
          defaultDepartment={
            data?.department
              ? {
                  id: data.department.id,
                  name: data.department.name,
                }
              : null
          }
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

export default UpdateEmployeeForm;
