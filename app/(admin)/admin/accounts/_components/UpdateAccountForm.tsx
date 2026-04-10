"use client";
import { Account } from "@/@types/account.types";
import { updateAccount } from "@/actions/AccountAction";
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
import { accountSchema, AccountSchemaType } from "@/schemas/account.schema";
import { setApiErrors } from "@/utils/setFormErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const UpdateAccountForm = ({
  data,
  onSuccess,
}: {
  data: Account;
  onSuccess: (data: Account) => void;
}) => {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const {
    control,
    handleSubmit,
    setError: setFormError,
  } = useForm<AccountSchemaType>({
    defaultValues: {
      accountNo: data?.accountNo || "",
      name: data?.name || "",
      initialBalance: Number(data?.initialBalance) || 0,
      note: data?.note || "",
      status: data?.status || true,
    },
    resolver: zodResolver(accountSchema),
  });

  const onSubmit = (payload: AccountSchemaType) =>
    startTransition(async () => {
      try {
        const response = await updateAccount(data.id, payload);

        if (!response.success && response?.errors)
          setApiErrors(response.errors, setFormError);
        else if (!response.success)
          throw new Error(response?.message || "Failed to update account");
        else {
          onSuccess(response?.data);
          toast.success("Account updated successfully");
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
          name="accountNo"
          label="Account No"
          placeholder="Enter a valid account number"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="name"
          label="Account Name"
          placeholder="Enter a valid account name"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="initialBalance"
          label="Initial Balance"
          placeholder="Enter a valid initial balance"
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
          placeholder="Eg: Supplier account"
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

export default UpdateAccountForm;
