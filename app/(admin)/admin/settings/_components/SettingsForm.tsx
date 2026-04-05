"use client";
import CurrencyAutocomplete from "@/components/common/autocompletes/CurrencyAutocomplete";
import CurrencyCodeAutocomplete from "@/components/common/autocompletes/CurrencyCodeAutocomplete";
import DateFormatAutocomplete from "@/components/common/autocompletes/DateFormatAutocomplete";
import TimezoneAutocomplete from "@/components/common/autocompletes/TimezoneAutocomplete";
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
import { settingsSchema, SettingsSchemaType } from "@/schemas/settings.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

const SettingsForm = () => {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const {
    control,
    handleSubmit,
    setError: setFormError,
  } = useForm<SettingsSchemaType>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      title: "",
      address: null,
      currencyCode: "",
      logo: undefined,
      favicon: undefined,
      currencySymbol: "",
      currencyPosition: "postfix",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      dateFormat: "MM/DD/YYYY",
      invoicePrefix: "INV-",
      invoiceNumber: 1,
    },
  });

  const onSubmit = (data: SettingsSchemaType) => console.log(data);
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
          name="title"
          label="Title"
          placeholder="Enter a valid site title"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="address"
          label="Address"
          placeholder="Enter a valid address"
          disabled={isPending}
        />
        <div className="grid grid-cols-2 gap-4">
          <FileUploader
            control={control}
            name="logo"
            label="Logo"
            acceptTypes={["image/jpeg", "image/png", "image/gif"]}
            placeholder="Upload your logo"
            disabled={isPending}
          />
          <FileUploader
            control={control}
            name="favicon"
            label="Favicon"
            acceptTypes={[
              "image/jpeg",
              "image/png",
              "image/gif",
              "image/x-icon",
              "image/vnd.microsoft.icon",
            ]}
            placeholder="Upload your favicon"
            disabled={isPending}
          />
        </div>
        <CurrencyCodeAutocomplete
          control={control}
          name="currencyCode"
          label="Currency Code"
          disabled={isPending}
        />
        <CurrencyAutocomplete
          control={control}
          name="currencySymbol"
          label="Currency Symbol"
          disabled={isPending}
        />
        <CustomSelect
          control={control}
          name="currencyPosition"
          label="Currency Position"
          disabled={isPending}
          data={[
            { value: "prefix", label: "Prefix (e.g. $100)" },
            { value: "postfix", label: "Postfix (e.g. 100$)" },
          ]}
        />
        <TimezoneAutocomplete
          control={control}
          name="timezone"
          label="Timezone"
          disabled={isPending}
        />

        <DateFormatAutocomplete
          control={control}
          name="dateFormat"
          label="Date Format"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="invoicePrefix"
          label="Invoice Prefix"
          placeholder="Enter a valid invoice prefix"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="invoiceNumber"
          label="Invoice Number"
          placeholder="Enter a valid invoice number"
          disabled={isPending}
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

export default SettingsForm;
