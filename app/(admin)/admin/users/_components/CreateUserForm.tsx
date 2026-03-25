"use client";
import { User } from "@/@types/user.types";
import { createUser } from "@/actions/UserAction";
import RoleAutocomplete from "@/components/common/autocompletes/RoleAutocomplete";
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
import { createUserSchema, CreateUserSchemaType } from "@/schemas/user.schema";
import { setApiErrors } from "@/utils/setFormErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const CreateMenuForm = ({ onSuccess }: { onSuccess: (data: User) => void }) => {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const {
    control,
    handleSubmit,
    setError: setFormError,
  } = useForm<CreateUserSchemaType>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNo: "",
      password: "",
      roleId: undefined,
      avatar: "",
      gender: true,
      status: true,
    },
  });

  const onSubmit = (data: CreateUserSchemaType) =>
    startTransition(async () => {
      try {
        const response = await createUser(data);

        if (!response.success && response?.errors)
          setApiErrors(response.errors, setFormError);
        else if (!response.success)
          throw new Error(response?.message || "Failed to create user");
        else {
          onSuccess(response?.data);
          toast.success("User created successfully");
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
      <FieldGroup className="grid grid-cols-2">
        <FormInput
          control={control}
          name="name"
          label="User Name"
          placeholder="Enter a valid user name"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="email"
          label="User Email"
          placeholder="Enter a valid user email"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="phoneNo"
          label="Phone Number"
          placeholder="Enter a valid phone number"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="password"
          type="password"
          label="Password"
          placeholder="Enter a valid password"
          disabled={isPending}
        />
        <RoleAutocomplete control={control} name="roleId" label="Role" />
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
        <div className="col-span-2">
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
        </div>
        <div className="col-span-2">
          <Field>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner data-icon="inline-start" /> : ""}
              Create New
            </Button>
          </Field>
        </div>
      </FieldGroup>
    </form>
  );
};

export default CreateMenuForm;
