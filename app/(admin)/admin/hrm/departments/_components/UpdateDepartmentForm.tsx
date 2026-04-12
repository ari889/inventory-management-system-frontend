"use client";
import { Department } from "@/@types/department.types";
import { updateDepartment } from "@/actions/DepartmentAction";
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
  departmentSchema,
  DepartmentSchemaType,
} from "@/schemas/department.schema";
import { setApiErrors } from "@/utils/setFormErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const UpdateDepartmentForm = ({
  data,
  onSuccess,
}: {
  data: Department;
  onSuccess: (data: Department) => void;
}) => {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const {
    control,
    handleSubmit,
    setError: setFormError,
  } = useForm<DepartmentSchemaType>({
    defaultValues: {
      name: data?.name || "",
      status: data?.status || false,
    },
    resolver: zodResolver(departmentSchema),
  });

  const onSubmit = (payload: DepartmentSchemaType) =>
    startTransition(async () => {
      try {
        const response = await updateDepartment(data.id, payload);

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
          label="Department Name"
          placeholder="Eg: HRM, Finance, IT, etc."
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

export default UpdateDepartmentForm;
