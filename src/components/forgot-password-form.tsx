"use client";

import { useState } from "react"
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
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Rocket, Mail, ArrowLeft, Loader2 } from "lucide-react"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate sending reset email
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <Card className="border border-[#E7DED4] shadow-lg rounded-2xl bg-white text-center">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-500">
            <Mail className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-lg font-black text-stone-900">Periksa Email Anda</CardTitle>
            <p className="text-xs text-stone-500 font-semibold leading-relaxed">
              Tautan pemulihan kata sandi telah dikirim ke alamat email Anda. Silakan ikuti instruksi di sana.
            </p>
          </div>
          <Button asChild variant="outline" className="w-full border-[#E7DED4] text-xs font-bold h-9 hover:bg-[#FAF6F0]">
            <Link href="/login">
              <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Kembali ke Masuk
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border border-[#E7DED4] shadow-lg rounded-2xl bg-white">
        <CardHeader className="text-center pb-4 pt-6 sm:pt-8 px-6 sm:px-8">
          <CardTitle className="text-xl font-black text-stone-900 tracking-tight">Lupa Kata Sandi?</CardTitle>
          <CardDescription className="text-xs text-stone-500 font-semibold mt-1">
            Masukkan email terdaftar Anda di bawah ini untuk menerima tautan pemulihan
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8 pt-0">
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              {/* Email Input */}
              <Field className="grid gap-1.5">
                <FieldLabel htmlFor="email" className="text-xs font-bold text-stone-700">Email Terdaftar</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  className="bg-[#FAF6F0] border-[#E7DED4] text-xs font-semibold focus-visible:ring-stone-400 placeholder:text-stone-300"
                  required
                />
              </Field>

              {/* Submit & Redirect */}
              <Field className="grid gap-4 mt-2">
                <Button type="submit" disabled={isLoading} className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs py-2 h-9 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <span>Kirim Tautan</span>
                      <Rocket className="w-3.5 h-3.5" />
                    </>
                  )}
                </Button>

                <FieldDescription className="text-center text-xs text-stone-500 font-semibold">
                  <Link href="/login" className="inline-flex items-center gap-1.5 font-bold text-stone-900 hover:underline">
                    <ArrowLeft className="w-3 h-3" /> Kembali ke Masuk
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
