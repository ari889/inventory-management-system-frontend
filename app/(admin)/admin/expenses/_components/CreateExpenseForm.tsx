"use client";
import { Expense } from "@/@types/expense.types";
import { createExpense } from "@/actions/ExpenseAction";
import AccountAutocomplete from "@/components/common/autocompletes/AccountAutocomplete";
import ExpenseCategoryAutocomplete from "@/components/common/autocompletes/ExpenseCategoryAutoComplete";
import WarehouseAutocomplete from "@/components/common/autocompletes/WarehouseAutocomplete";
import CustomSelect from "@/components/common/CustomSelect";
import FormInput from "@/components/common/FormInput";
import FormTextarea from "@/components/common/FormTextarea";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { expenseSchema, ExpenseSchemaType } from "@/schemas/expense.schema";
import { setApiErrors } from "@/utils/setFormErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const CreateExpenseForm = ({
  onSuccess,
}: {
  onSuccess: (data: Expense) => void;
}) => {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const {
    control,
    handleSubmit,
    setError: setFormError,
  } = useForm<ExpenseSchemaType>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      expenseCategoryId: undefined,
      warehouseId: undefined,
      accountId: undefined,
      amount: 0,
      note: "",
      status: true,
    },
  });

  const onSubmit = (data: ExpenseSchemaType) =>
    startTransition(async () => {
      try {
        const response = await createExpense(data);

        if (!response.success && response?.errors)
          setApiErrors(response.errors, setFormError);
        else if (!response.success)
          throw new Error(response?.message || "Failed to create expense");
        else {
          onSuccess(response?.data);
          toast.success("Expense created successfully");
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
        <ExpenseCategoryAutocomplete
          control={control}
          name="expenseCategoryId"
          label="Expense Category"
        />
        <WarehouseAutocomplete
          control={control}
          name="warehouseId"
          label="Warehouse"
        />
        <AccountAutocomplete
          control={control}
          name="accountId"
          label="Account"
        />
        <FormInput
          control={control}
          name="amount"
          label="Amount"
          placeholder="Eg: 1000.00"
          disabled={isPending}
          type="number"
          min={0}
          step="0.10"
          decimalScale={2}
        />
        <FormTextarea
          control={control}
          name="note"
          label="Note"
          placeholder="Eg: Note about the expense"
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

export default CreateExpenseForm;
