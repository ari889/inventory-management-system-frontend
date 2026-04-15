"use client";
import { Brand } from "@/@types/brand.types";
import { createBrand } from "@/actions/BrandAction";
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

const CreateBrandForm = ({
  onSuccess,
}: {
  onSuccess: (data: Brand) => void;
}) => {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const {
    control,
    handleSubmit,
    setError: setFormError,
  } = useForm<BrandSchemaType>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      title: "",
      image: undefined,
      status: true,
    },
  });

  const onSubmit = (data: BrandSchemaType) =>
    startTransition(async () => {
      try {
        const body = new FormData();
        body.append("title", data.title);
        body.append("status", String(data.status));

        if (data.image instanceof File) {
          body.append("image", data.image as File);
        }
        const response = await createBrand(body);

        if (!response.success && response?.errors)
          setApiErrors(response.errors, setFormError);
        else if (!response.success)
          throw new Error(response?.message || "Failed to create brand");
        else {
          onSuccess(response?.data);
          toast.success("Brand created successfully");
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

export default CreateBrandForm;
