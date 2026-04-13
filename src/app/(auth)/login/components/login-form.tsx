import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl">
            Welcome to <span className="text-primary font-bold">RMS ONE</span>
          </h1>
          <p className="text-sm text-balance text-muted-foreground">
            Sign in to your account below
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            className="bg-background"
          />
        </Field>
        <Field>
          <div className="flex items-center">Password</div>
          <Input
            id="password"
            type="password"
            required
            className="bg-background"
          />
        </Field>
        <Field>
          <Button type="submit">Sign In</Button>
        </Field>
      </FieldGroup>
      <p>Version 1.0.0</p>
    </form>
  );
}
