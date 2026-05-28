"use client";
import { User } from "@/@types/user.types";
import { updateProfile } from "@/actions/AuthAction";
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
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { profileSchema, ProfileSchemaType } from "@/schemas/profile.schema";
import { setApiErrors } from "@/utils/setFormErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, Save } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const UpdateProfileForm = ({ user }: { user: User }) => {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const {
    control,
    handleSubmit,
    setError: setFormError,
  } = useForm<ProfileSchemaType>({
    defaultValues: {
      name: user?.name || "",
      phoneNo: user?.phoneNo || "",
      gender: user?.gender || true,
      avatar: user?.avatar || undefined,
    },
    resolver: zodResolver(profileSchema),
  });

  const onSubmit = (data: ProfileSchemaType) =>
    startTransition(async () => {
      try {
        const body = new FormData();
        body.append("name", data.name);
        body.append("phoneNo", String(data.phoneNo));
        body.append("gender", String(data.gender));

        if (data.avatar instanceof File) {
          body.append("avatar", data.avatar as File);
        }

        const response = await updateProfile(body);

        if (!response.success && response?.errors)
          setApiErrors(response.errors, setFormError);
        else if (!response.success)
          throw new Error(response?.message || "Failed to update customer");
        else {
          toast.success("Customer updated successfully");
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
        <FileUploader
          control={control}
          name="avatar"
          label="Avatar"
          acceptTypes={["image/gif", "image/jpeg", "image/png"]}
          placeholder="Upload your avatar here"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="name"
          label="Name"
          placeholder="Eg: John Doe"
          disabled={isPending}
        />

        <FormInput
          control={control}
          name="phoneNo"
          label="Phone Number"
          placeholder="Eg: +91 1234567890"
          disabled={isPending}
        />

        <CustomSelect
          control={control}
          name="gender"
          label="Gender"
          disabled={isPending}
          data={[
            { value: true, label: "Male" },
            { value: false, label: "Female" },
          ]}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? <Spinner /> : <Save />}
          Save
        </Button>
      </FieldGroup>
    </form>
  );
};

export default UpdateProfileForm;
