import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { Section } from '../components/Section';
import { HowItWorks } from '../components/HowItWorks';
import { ProblemSection } from '../components/ProblemSection';
import { CBTSecuritySection } from '../components/CBTSecuritySection';
import { Testimonials } from '../components/Testimonials';
import { PricingSection } from '../components/PricingSection';
import { AboutSection } from '../components/AboutSection';
import { ContactSection } from '../components/ContactSection';
import { MagneticButton } from '../components/MagneticButton';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCtaClick = () => {
        if (user) {
            navigate('/chat');
        } else {
            navigate('/signup');
        }
    };

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
