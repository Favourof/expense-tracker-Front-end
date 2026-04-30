import FirstSection from "./component/FirstSection";
import SecondSection from "./component/SecondSection";
import HeroPage from "./component/HeroPage";
import StatsSection from "./component/StatsSection";
import HowItWorksSection from "./component/HowItWorksSection";
import StorySection from "./component/StorySection";
import IntegrationsSection from "./component/IntegrationsSection";
import CTASection from "./component/CTASection";
import FooterSection from "./component/FooterSection";

const HomePage = () => {
  return (
    <main>
      <FirstSection />
      <HeroPage />
      <StatsSection />
      <SecondSection />
      <HowItWorksSection />
      <StorySection />
      <IntegrationsSection />
      <CTASection />
      <FooterSection />
    </main>
  );
};

export default HomePage;
