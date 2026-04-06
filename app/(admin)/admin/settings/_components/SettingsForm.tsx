"use client";
import { Setting } from "@/@types/settings.types";
import { updateSettings } from "@/actions/SettingsAction";
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
import { setApiErrors } from "@/utils/setFormErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

const SettingsForm = ({ settings }: { settings: Setting[] }) => {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const {
    control,
    handleSubmit,
    setError: setFormError,
  } = useForm<SettingsSchemaType>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      title: settings.find((s) => s.name === "title")?.value || "",
      address: settings.find((s) => s.name === "address")?.value || null,
      currency_code:
        settings.find((s) => s.name === "currency_code")?.value || "",
      currency_symbol:
        settings.find((s) => s.name === "currency_symbol")?.value || "",
      currency_position:
        (settings.find((s) => s.name === "currency_position")?.value as
          | "prefix"
          | "postfix") || "postfix",
      timezone:
        settings.find((s) => s.name === "timezone")?.value ||
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      date_format:
        settings.find((s) => s.name === "date_format")?.value || "MM/DD/YYYY",
      invoice_suffix:
        settings.find((s) => s.name === "invoice_suffix")?.value || "INV-",
      invoice_number: parseInt(
        settings.find((s) => s.name === "invoice_number")?.value || "1",
      ),

      // ✅ Populate from server URL — FileUploader will show the image preview
      logo: settings.find((s) => s.name === "logo")?.value || undefined,
      favicon: settings.find((s) => s.name === "favicon")?.value || undefined,
    },
  });

  const onSubmit: SubmitHandler<SettingsSchemaType> = (data) =>
    startTransition(async () => {
      try {
        const body = new FormData();
        body.append("title", data.title);
        body.append("address", data.address ?? "");
        body.append("currency_code", data.currency_code);
        body.append("currency_symbol", data.currency_symbol);
        body.append("currency_position", data.currency_position);
        body.append("timezone", data.timezone);
        body.append("date_format", data.date_format);
        body.append("invoice_suffix", data.invoice_suffix);
        body.append("invoice_number", String(data.invoice_number));

        if (data.logo instanceof File) {
          body.append("logo", data.logo, data.logo.name);
        }
        if (data.favicon instanceof File) {
          body.append("favicon", data.favicon, data.favicon.name);
        }

        const response = await updateSettings(body);

        if (!response.success && response?.errors)
          setApiErrors(response.errors, setFormError);
        else if (!response.success)
          throw new Error(response?.message || "Failed to update settings");
        else toast.success("Settings updated successfully");
      } catch (error) {
        if (error instanceof Error) setError(error.message);
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
          name="currency_code"
          label="Currency Code"
          disabled={isPending}
        />
        <CurrencyAutocomplete
          control={control}
          name="currency_symbol"
          label="Currency Symbol"
          disabled={isPending}
        />
        <CustomSelect
          control={control}
          name="currency_position"
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
          name="date_format"
          label="Date Format"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="invoice_suffix"
          label="Invoice Suffix"
          placeholder="Enter a valid invoice suffix"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="invoice_number"
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
