import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { loginSchema } from "@/lib/schema/auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const { success, error: ErrorToast } = useToast();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await signIn("credentials", {
          email: value.email,
          password: value.password,
          redirect: false,
          callbackUrl: "/dashboard",
        });

        if (response?.ok) {
          success("Logged in successfully");
          router.push(response.url ?? "/dashboard");
        } else {
          throw response?.error || "Login failed";
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        ErrorToast(message || "Login failed");
      }
    },
  });

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl">
            Welcome to <span className="text-primary font-bold">RMS ONE</span>
          </h1>
          <p className="text-sm text-balance text-muted-foreground">
            Sign in to your account below
          </p>
        </div>
        <form.Field name="email">
          {(field) => {
            const error =
              field.state.meta.isTouched && !field.state.meta.isValid
                ? field.state.meta.errors
                : undefined;

            return (
              <Field data-invalid={!!error}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={!!error}
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="bg-background"
                />
                {error && <FieldError errors={error} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="password">
          {(field) => {
            const error =
              field.state.meta.isTouched && !field.state.meta.isValid
                ? field.state.meta.errors
                : undefined;

            return (
              <Field data-invalid={!!error}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={!!error}
                  autoComplete="current-password"
                  className="bg-background"
                />
                {error && <FieldError errors={error} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Subscribe
          selector={(state) => ({
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
        >
          {({ canSubmit, isSubmitting }) => (
            <Field>
              <Button type="submit" disabled={!canSubmit}>
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            </Field>
          )}
        </form.Subscribe>
      </FieldGroup>
      <p>Version 1.0.0</p>
    </form>
  );
}
