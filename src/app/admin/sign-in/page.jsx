'use client'
import React from "react";
import { LoginForm } from "@/components/login-form"
import Image from "next/image";

export default function Page() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <Image src="/images/logo.png" alt="Logo" width={200} height={200} className="mx-auto mb-10" />
        <LoginForm />
      </div>
    </div>
  )
}