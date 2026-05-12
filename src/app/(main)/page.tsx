import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Workflow } from "@/components/landing/Workflow";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { CTA } from "@/components/landing/CTA";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFB] font-sans selection:bg-primary/20 overflow-x-hidden">
      <div className="relative z-10">
        {/* Background Sophistication (Original) */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40"></div>
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-blue-50/40 blur-[140px] -z-10 rounded-xl"></div>
        <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-amber-50/30 blur-[140px] -z-10 rounded-xl"></div>

        <Hero />
        <Features />
        <Workflow />
        <Pricing />
        <Testimonials />
        <CTA />
      </div>
    </div>
  );
}