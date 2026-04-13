"use client";

import { LoginForm } from "@/app/(auth)/login/components/login-form";
import { setDocumentTitle } from "@/lib/utils";
import Image from "next/image";
import { useEffect } from "react";

export default function LoginPage() {
  useEffect(() => {
    setDocumentTitle("Login");
  }, []);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <Image
          unoptimized
          width={90}
          height={90}
          src="/images/logo.png"
          alt="Logo"
        />
        <div className="flex flex-1 items-center justify-center">
          <div></div>
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
        <div className="flex text-[10px] justify-between text-muted-foreground px-2 py-2 border-t">
          <p>© 2023 GX APP - Committed to better quality</p>
          <p>Design & Development By GlobalXtreme</p>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          unoptimized
          width={100}
          height={100}
          src="/images/banner-login.png"
          alt="Image Banner"
          className="absolute inset-0 h-full w-full "
        />
      </div>
    </div>
  );
}
