import React from "react";
import Layout from "../components/common/Layout";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import Testimonials from "../components/landing/Testimonials";
import SignupForm from "../components/landing/SignupForm";

const LandingPage: React.FC = () => {
  return (
    <Layout>
      {/* 1. Hero section */}
      <Hero />
      {/* 2. Begin Your Cosmic Journey section (SignupForm) */}
      <SignupForm />
      {/* 3. Cosmic Insights Tailored for You section (Features) */}
      <Features />
      {/* 4. How Luraaya Works section - aktuell ausgeblendet */}
      {/* <HowItWorks /> */}
      {/* 5. Loved by Cosmic Seekers section (Testimonials) */}
      {/*<Testimonials />*/}
    </Layout>
  );
};

export default LandingPage;
