import { Hero } from "@/components/landing/Hero";
import { CalculatorSection } from "@/components/landing/CalculatorSection";
import { Features } from "@/components/landing/Features";
import { Workflow } from "@/components/landing/Workflow";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <CalculatorSection />
      <Features />
      <Workflow />
      <Pricing />
      <Testimonials />
    </>
  );
}