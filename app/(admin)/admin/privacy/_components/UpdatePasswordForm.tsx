"use client";
import { updatePassword } from "@/actions/AuthAction";
import FormInput from "@/components/common/FormInput";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  changePasswordSchema,
  ChangePasswordSchemaType,
} from "@/schemas/password.schema";
import { setApiErrors } from "@/utils/setFormErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, Save } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const UpdatePasswordForm = () => {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const {
    control,
    handleSubmit,
    setError: setFormError,
    reset,
  } = useForm<ChangePasswordSchemaType>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      reEnterPassword: "",
    },
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = (data: ChangePasswordSchemaType) =>
    startTransition(async () => {
      try {
        const response = await updatePassword(data);

        if (!response.success && response?.errors)
          setApiErrors(response.errors, setFormError);
        else if (!response.success)
          throw new Error(response?.message || "Failed to update password");
        else {
          if (!isLoggedIn) signOut();
          toast.success(response?.message || "Password updated successfully!");
          reset();
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
          name="oldPassword"
          type="password"
          label="Old Password"
          placeholder="Enter a valid password"
          disabled={isPending}
        />

        <FormInput
          control={control}
          name="newPassword"
          type="password"
          label="New Password"
          placeholder="Enter a valid new password"
          disabled={isPending}
        />

        <FormInput
          control={control}
          name="reEnterPassword"
          type="password"
          label="Re-Enter Password"
          placeholder="Re-enter your new password"
          disabled={isPending}
        />
        <Field orientation="horizontal">
          <Checkbox
            id="isLoggedIn"
            checked={isLoggedIn}
            onCheckedChange={() =>
              setIsLoggedIn((prev) => {
                return !prev;
              })
            }
          />
          <Label htmlFor="isLoggedIn">Keep me logged in</Label>
        </Field>

        <Button type="submit" disabled={isPending}>
          {isPending ? <Spinner /> : <Save />}
          Save
        </Button>
      </FieldGroup>
    </form>
  );
};

export default UpdatePasswordForm;
