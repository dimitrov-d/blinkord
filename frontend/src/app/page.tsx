import FAQ from "@/components/home/FAQ";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import Features from "@/components/home/Features";
import MeetTheBot from "@/components/home/MeetTheBot";
import CTA from "@/components/home/CTA";

const Index: React.FC = () => (
  <main className="font-excon">
    <HeroSection />
    <Features />
    <HowItWorks />
    <MeetTheBot />
    <FAQ />
    <CTA />
  </main>
);

export default Index;
