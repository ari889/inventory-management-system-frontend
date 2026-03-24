"use client";
import FormInput from "@/components/common/FormInput";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { authSchema, AuthSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

const Login = ({ callbackUrl }: { callbackUrl: string }) => {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { control, handleSubmit } = useForm<AuthSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: AuthSchema) => {
    startTransition(async () => {
      try {
        const response = await signIn("credentials", {
          ...data,
          redirect: false,
          callbackUrl,
        });

        if (response?.ok && response.url) {
          router.push(response.url);
        } else {
          throw new Error(response?.error ?? "Login failed!");
        }
      } catch (error) {
        if (error instanceof Error) setError(error?.message);
        else setError("Something went wrong");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon />
          <AlertTitle>Login failed</AlertTitle>
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
          name="email"
          label="Email"
          placeholder="Enter a valid email"
          disabled={isPending}
        />
        <FormInput
          control={control}
          name="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          disabled={isPending}
        />
        <Field>
          <Button type="submit" disabled={isPending}>
            Login
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default Login;
