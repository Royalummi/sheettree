import SEOHead from "../../components/Landing/SEOHead";
import HeroSection from "../../components/Landing/HeroSection";
import FeaturesSection from "../../components/Landing/FeaturesSection";
import HowItWorksSection from "../../components/Landing/HowItWorksSection";
import StatsSection from "../../components/Landing/StatsSection";
import PricingSection from "../../components/Landing/PricingSection";
import CTASection from "../../components/Landing/CTASection";
import Footer from "../../components/Landing/Footer";

/**
 * Landing Page
 * Modern, animated landing page for SheetTree
 * Showcases features, pricing, and drives conversions
 */
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* SEO Meta Tags */}
      <SEOHead />

      {/* Main Content */}
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <StatsSection />
        <PricingSection />
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
