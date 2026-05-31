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
import { useRouter } from "next/navigation";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { signUpSchema } from "@/lib/schemas/Schemas";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/client_auth";

type SignUpSchema = z.infer<typeof signUpSchema>;
const SignUpForm = () => {
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const handleSignUp = async (data: SignUpSchema) => {
    const result = await authClient.signUp.email(data);
    if (result.error) {
      toast.error(
        result.error.message || "Error While Sign Up please try again later",
      );
      return;
    }
    toast.success("Welcome Onboard");
    router.push("/profile");
  };
  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSignUp)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                type="text"
                {...field}
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                placeholder="Enter your name"
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
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
          className="cursor-pointer"
        >
          Reset
        </Button>
        <Button type="submit">
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            Sign Up
          </LoadingSwap>
        </Button>
      </Field>
    </form>
  );
};

export default SignUpForm;
