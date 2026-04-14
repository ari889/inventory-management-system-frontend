"use client";
import { HRMSetting } from "@/@types/hrm-settings.types";
import { createOrUpdateHrmSetting } from "@/actions/HrmSettingAction";
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
  hrmSettingSchema,
  HRMSettingSchemaType,
} from "@/schemas/hrm-setting.schema";
import { setApiErrors } from "@/utils/setFormErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const CreateOrUpdateHRMSetting = ({ data }: { data: HRMSetting }) => {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const {
    control,
    handleSubmit,
    setError: setFormError,
  } = useForm<HRMSettingSchemaType>({
    resolver: zodResolver(hrmSettingSchema),
    defaultValues: {
      checkIn: data?.checkIn?.toString() ?? "",
      checkOut: data?.checkOut?.toString() ?? "",
    },
  });

  const onSubmit = (data: HRMSettingSchemaType) =>
    startTransition(async () => {
      try {
        const response = await createOrUpdateHrmSetting(data);

        if (!response.success && response?.errors)
          setApiErrors(response.errors, setFormError);
        else if (!response.success)
          throw new Error(response?.message || "Failed to create hrm setting");
        else {
          toast.success("HRM Setting created successfully");
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
        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Spinner data-icon="inline-start" /> : ""}
            Update
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default CreateOrUpdateHRMSetting;
