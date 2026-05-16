"use client";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client_auth";
import { toast } from "sonner";
import { LoadingSwap } from "@/components/ui/loading-swap";
const signInSchema = z.object({
  email: z.email().min(1),
  password: z.string().min(8),
});

type signInSchema = z.infer<typeof signInSchema>;
const SignInForm = () => {
  const form = useForm<signInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const handleSignIn = async(data: signInSchema) => {
    await authClient.signIn.email(
      {
        ...data,
        callbackURL: "/home",
      },
      {
        onError: (error) => {
          toast.error(
            error.error.message || "Error While Sign In please try again later",
          );
        },
      },
    );
  };
  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSignIn)}>
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                {...field}
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                placeholder="Enter your email"
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                {...field}
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                placeholder="Enter your pasword"
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Field orientation="horizontal" className="justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset()}
          disabled={form.formState.isSubmitting}
          className="cursor-pointer"
        >
          Reset
        </Button>
        <Button
          type="submit"
          className="cursor-pointer"
          disabled={form.formState.isSubmitting}
        >
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            Sign In
          </LoadingSwap>
        </Button>
      </Field>
    </form>
  );
};

export default SignInForm;
