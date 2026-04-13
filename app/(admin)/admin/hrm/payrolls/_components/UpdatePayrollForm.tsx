"use client";
import { Payroll } from "@/@types/payroll.types";
import { updatePayroll } from "@/actions/PayrollAction";
import AccountAutocomplete from "@/components/common/autocompletes/AccountAutocomplete";
import EmployeeAutocomplete from "@/components/common/autocompletes/EmployeeAutocomplete";
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
import { payrollSchema, PayrollSchemaType } from "@/schemas/payroll.schema";
import { setApiErrors } from "@/utils/setFormErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const UpdatePayrollForm = ({
  data,
  onSuccess,
}: {
  data: Payroll;
  onSuccess: (data: Payroll) => void;
}) => {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const {
    control,
    handleSubmit,
    setError: setFormError,
  } = useForm<PayrollSchemaType>({
    defaultValues: {
      employeeId: data?.employee?.id || undefined,
      accountId: data?.account?.id || undefined,
      amount: data?.amount || "",
      paymentMethods: data?.paymentMethods || "CASH",
    },
    resolver: zodResolver(payrollSchema),
  });

  const onSubmit = (payload: PayrollSchemaType) =>
    startTransition(async () => {
      try {
        const response = await updatePayroll(data.id, payload);

        if (!response.success && response?.errors)
          setApiErrors(response.errors, setFormError);
        else if (!response.success)
          throw new Error(response?.message || "Failed to update payroll");
        else {
          onSuccess(response?.data);
          toast.success("Payroll updated successfully");
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
          defaultEmployee={
            data?.employee
              ? {
                  id: data.employee.id,
                  name: data.employee.name,
                }
              : null
          }
        />
        <AccountAutocomplete
          control={control}
          name="accountId"
          label="Account"
          defaultAccount={
            data?.account
              ? {
                  id: data.account.id,
                  name: data.account.name,
                }
              : null
          }
        />
        <FormInput
          control={control}
          name="amount"
          label="Amount"
          placeholder="Enter a valid amount"
          disabled={isPending}
          type="number"
          min={0}
          step="0.01"
          decimalScale={2}
        />
        <CustomSelect
          control={control}
          name="paymentMethods"
          label="Payment Method"
          disabled={isPending}
          data={[
            { value: "CASH", label: "Cash" },
            { value: "CHEQUE", label: "Cheque" },
            { value: "BANK", label: "Bank" },
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

export default UpdatePayrollForm;
