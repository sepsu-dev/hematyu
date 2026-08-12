"use client"

import { ForgotPasswordForm } from "@/components/forgot-password-form"
import { Logo } from "@/components/logo"
import Link from "next/link"

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#FAF6F0] p-6 md:p-10 relative overflow-hidden text-stone-900">
      {/* Background Grid */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#11182706_1px,transparent_1px),linear-gradient(to_bottom,#11182706_1px,transparent_1px)] bg-[size:32px_32px] opacity-100 pointer-events-none"></div>

      {/* Decorative glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#E35B30]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="flex w-full max-w-sm flex-col gap-6 relative z-10">
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-2.5 self-center group">
          <div className="flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
            <Logo className="h-8 w-auto" />
          </div>
          <span className="font-extrabold text-stone-950 text-base tracking-tight">
            hemat.yu
          </span>
        </Link>
        
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
