import { Hero } from './Hero';
import { HowItWorks } from './HowItWorks';
import { ProblemSection } from './ProblemSection';
import { CBTSecuritySection } from './CBTSecuritySection';
import { Testimonials } from './Testimonials';
import { PricingSection } from './PricingSection';
import { AboutSection } from './AboutSection';
import { ContactSection } from './ContactSection';

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
