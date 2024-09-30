import FAQ from "@/components/home/FAQ";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import MeetTheBot from "@/components/home/MeetTheBot";

const Index: React.FC = () => {
  return (
    <main>
      <HeroSection />
      <HowItWorks />
      <MeetTheBot />
      <FAQ />
    </main>
  );
};

export default Index;
