"use client";
import { Attendance } from "@/@types/attendance.types";
import { createAttendance } from "@/actions/AttendanceAction";
import EmployeeAutocomplete from "@/components/common/autocompletes/EmployeeAutocomplete";
import CustomSelect from "@/components/common/CustomSelect";
import FormDatePicker from "@/components/common/FormDatePicker";
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
  attendanceSchema,
  AttendanceSchemaType,
} from "@/schemas/attendance.schema";
import { setApiErrors } from "@/utils/setFormErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { AlertCircleIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const CreateAttendanceForm = ({
  onSuccess,
}: {
  onSuccess: (data: Attendance) => void;
}) => {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const {
    control,
    handleSubmit,
    setError: setFormError,
  } = useForm<AttendanceSchemaType>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      employeeId: undefined,
      date: new Date(),
      checkIn: format(new Date(), "HH:mm:ss"),
      checkOut: null,
      status: true,
    },
  });

  const onSubmit = (data: AttendanceSchemaType) =>
    startTransition(async () => {
      try {
        const response = await createAttendance(data);

        if (!response.success && response?.errors)
          setApiErrors(response.errors, setFormError);
        else if (!response.success)
          throw new Error(response?.message || "Failed to create attendance");
        else {
          onSuccess(response?.data);
          toast.success("Attendance created successfully");
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
        <EmployeeAutocomplete
          control={control}
          name="employeeId"
          label="Employee"
        />
        <FormDatePicker
          control={control}
          name="date"
          label="Date"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="checkIn"
          type="time"
          label="Check In"
          step="1"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="checkOut"
          type="time"
          label="Check Out"
          step="1"
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

export default CreateAttendanceForm;
