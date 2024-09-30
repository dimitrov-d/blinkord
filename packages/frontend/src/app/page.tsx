import FAQ from "@/components/home/FAQ";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import Features from "@/components/home/Features";
import MeetTheBot from "@/components/home/MeetTheBot";

const Index: React.FC = () => {
  return (
    <main>
      <HeroSection />
      <Features />
      <HowItWorks />
      <MeetTheBot />
      <FAQ />
    </main>
  );
};

export default Index;
