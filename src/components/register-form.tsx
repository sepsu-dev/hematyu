"use client";

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { registerAction } from "@/app/actions"
import { Rocket, ShieldAlert } from "lucide-react"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border border-[#E7DED4] shadow-lg rounded-2xl bg-white">
        <CardHeader className="text-center pb-4 pt-6 sm:pt-8 px-6 sm:px-8">
          <CardTitle className="text-xl font-black text-stone-900 tracking-tight">Daftar Akun Baru</CardTitle>
          <CardDescription className="text-xs text-stone-500 font-semibold mt-1">
            Buat akun gratis hemat.yu untuk mulai mengelola keuangan Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8 pt-0">
          <form action={registerAction}>
            <FieldGroup>
              {/* Alert Error */}
              {error && (
                <Field>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-600 font-semibold leading-tight">{error}</p>
                  </div>
                </Field>
              )}

              {/* Daftar dengan Google */}
              <Field>
                <Button variant="outline" type="button" className="w-full border-[#E7DED4] text-xs font-bold h-9 hover:bg-[#FAF6F0]">
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                  </svg>
                  Daftar dengan Google
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-white text-[10px] font-black text-stone-400">
                Or continue with
              </FieldSeparator>

              {/* Nama Input */}
              <Field className="grid gap-1.5">
                <FieldLabel htmlFor="name" className="text-xs font-bold text-stone-700">Nama Lengkap</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Budi Santoso"
                  className="bg-[#FAF6F0] border-[#E7DED4] text-xs font-semibold focus-visible:ring-stone-400 placeholder:text-stone-300"
                  required
                />
              </Field>

              {/* Email Input */}
              <Field className="grid gap-1.5">
                <FieldLabel htmlFor="email" className="text-xs font-bold text-stone-700">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nama@email.com"
                  className="bg-[#FAF6F0] border-[#E7DED4] text-xs font-semibold focus-visible:ring-stone-400 placeholder:text-stone-300"
                  required
                />
              </Field>

              {/* Password Input */}
              <Field className="grid gap-1.5">
                <FieldLabel htmlFor="password" className="text-xs font-bold text-stone-700">Kata Sandi</FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimal 6 karakter"
                    minLength={6}
                    className="bg-[#FAF6F0] border-[#E7DED4] text-xs font-semibold focus-visible:ring-stone-400 placeholder:text-stone-300 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 focus:outline-none"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </Field>

              {/* Submit & Redirect */}
              <Field className="grid gap-4 mt-2">
                <Button type="submit" className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs py-2 h-9 flex items-center justify-center gap-2">
                  <span>Daftar Sekarang</span>
                  <Rocket className="w-3.5 h-3.5" />
                </Button>

                <FieldDescription className="text-center text-xs text-stone-500 font-semibold">
                  Sudah punya akun?{" "}
                  <Link href="/login" className="font-bold text-stone-900 hover:underline">
                    Masuk
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-[10px] text-stone-400 font-semibold [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
