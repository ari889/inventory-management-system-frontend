"use client";
import { Purchase } from "@/@types/purchase.types";
import { createPurchasePayment } from "@/actions/PurchasePaymentAction";
import AccountAutocomplete from "@/components/common/autocompletes/AccountAutocomplete";
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
import {
  purchasePaymentSchema,
  PurchasePaymentSchemaType,
} from "@/schemas/purchase-payment.schema";
import { setApiErrors } from "@/utils/setFormErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const AddPurchasePaymentForm = ({
  purchase,
  onSuccess,
  toggleModal,
}: {
  purchase: Purchase;
  onSuccess: (paymentSatatus: boolean, paidAmount: string) => void;
  toggleModal: () => void;
}) => {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const {
    control,
    handleSubmit,
    setError: setFormError,
    watch,
    setValue,
  } = useForm<PurchasePaymentSchemaType>({
    resolver: zodResolver(purchasePaymentSchema),
    defaultValues: {
      accountId: undefined,
      purchaseId: purchase?.id,
      amount: "0.00",
      change: purchase?.grandTotal,
      paymentMethod: "CASH",
      paymentNote: "",
    },
  });

  const amount = watch("amount");

  useEffect(() => {
    const total = parseFloat(purchase?.grandTotal || "0.00");
    const paid = parseFloat(amount || "0.00");

    const change = total - paid;

    setValue("change", change.toFixed(2));
  }, [amount, setValue, purchase?.grandTotal]);

  const onSubmit = (data: PurchasePaymentSchemaType) =>
    startTransition(async () => {
      try {
        const response = await createPurchasePayment(data);

        if (!response.success && response?.errors)
          setApiErrors(response.errors, setFormError);
        else if (!response.success)
          throw new Error(
            response?.message || "Failed to create purchasePayment",
          );
        else {
          onSuccess(response?.data?.paymentStatus, response?.data?.paidAmount);
          toggleModal();
          toast.success("PurchasePayment created successfully");
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
        <AccountAutocomplete
          control={control}
          name="accountId"
          label="Account"
        />
        <FormInput
          control={control}
          name="amount"
          label="Paying Amount"
          placeholder="Eg: 1000.00"
          disabled={isPending}
          type="number"
          min={0}
          max={purchase?.grandTotal}
          step="0.01"
          decimalScale={2}
        />
        <FormInput
          control={control}
          name="change"
          label="Change"
          placeholder="Eg: 1000.00"
          disabled={isPending}
          type="number"
          min={0}
          step="0.01"
          decimalScale={2}
        />
        <CustomSelect
          control={control}
          name="paymentMethod"
          label="Payment Method"
          disabled={isPending}
          data={[
            { value: "CASH", label: "Cash" },
            { value: "CHEQUE", label: "Cheque" },
            { value: "BANK", label: "Bank" },
          ]}
        />
        <FormTextarea
          control={control}
          name="paymentNote"
          label="Note"
          placeholder="Eg: Payment for purchase #12345"
          disabled={isPending}
        />
        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Spinner data-icon="inline-start" /> : ""}
            Add New
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default AddPurchasePaymentForm;
