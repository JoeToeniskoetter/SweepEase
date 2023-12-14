import React from "react";
import Navbar from "./Navbar";
import Link from "next/link";
import { HeroSection } from "./HeroSection";
import { PricingSection } from "./PricingSection";

export const LandingPage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-900 h-screen">
      <Navbar />
      <HeroSection />
      <PricingSection />
    </div>
  );
};
