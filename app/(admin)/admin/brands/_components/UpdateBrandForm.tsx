"use client";
import { Brand } from "@/@types/brand.types";
import { updateBrand } from "@/actions/BrandAction";
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
import { brandSchema, BrandSchemaType } from "@/schemas/brand.schema";
import { setApiErrors } from "@/utils/setFormErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const UpdateBrandForm = ({
  data,
  onSuccess,
}: {
  data: Brand;
  onSuccess: (data: Brand) => void;
}) => {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const {
    control,
    handleSubmit,
    setError: setFormError,
  } = useForm<BrandSchemaType>({
    defaultValues: {
      title: data?.title || "",
      image: data?.image || undefined,
      status: data?.status || true,
    },
    resolver: zodResolver(brandSchema),
  });

  const onSubmit = (payload: BrandSchemaType) =>
    startTransition(async () => {
      try {
        const body = new FormData();
        body.append("title", payload.title);
        body.append("status", String(payload.status));

        if (payload.image instanceof File) {
          body.append("image", payload.image as File, payload.image.name);
        }
        const response = await updateBrand(data.id, body);

        if (!response.success && response?.errors)
          setApiErrors(response.errors, setFormError);
        else if (!response.success)
          throw new Error(response?.message || "Failed to update brand");
        else {
          onSuccess(response?.data);
          toast.success("Brand updated successfully");
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
          name="title"
          label="Brand Name"
          placeholder="Enter a valid brand name"
          disabled={isPending}
        />
        <FileUploader
          control={control}
          name="image"
          label="Brand Image"
          acceptTypes={["image/jpeg", "image/png", "image/gif"]}
          placeholder="Upload your brand image"
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

export default UpdateBrandForm;
