import { HeroSection } from "./components/hero-section";
import { ProblemAgitation } from "./components/problem-agitation";
import { HowItWorks } from "./components/how-it-works";
import { FaqSection } from "./components/faq-section";
import { FinalCta } from "./components/final-cta";
import { Navbar } from "./components/navbar";

export default function LandingPage() {
  return (
    <div className="relative w-full min-h-screen bg-background text-on-background font-sans antialiased selection:bg-primary/20 selection:text-primary-dark overflow-x-clip">
      <Navbar />
      <main id="main-content" className="relative z-10 w-full flex flex-col gap-24 pb-24">
        <HeroSection />
        <ProblemAgitation />
        <HowItWorks />
        <FaqSection />
        <FinalCta />
      </main>
    </div>
  );
}
