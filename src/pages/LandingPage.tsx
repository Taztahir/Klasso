import { Hero } from '../components/Hero';
import { HowItWorks } from '../components/HowItWorks';
import { ProblemSection } from '../components/ProblemSection';
import { CBTSecuritySection } from '../components/CBTSecuritySection';
import { Testimonials } from '../components/Testimonials';
import { PricingSection } from '../components/PricingSection';
import { AboutSection } from '../components/AboutSection';
import { ContactSection } from '../components/ContactSection';

export const LandingPage = () => {
    return (
        <main className="overflow-x-clip">
            <Hero />

            <ProblemSection />
            <AboutSection />
            <HowItWorks />
            <PricingSection />
            <CBTSecuritySection />
            <Testimonials />
            <ContactSection />


        </main>
    );
};
