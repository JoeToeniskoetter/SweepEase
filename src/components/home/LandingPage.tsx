import React from "react";
import Navbar from "../Navbar";
import { HeroSection } from "./HeroSection";
import { PricingSection } from "./PricingSection";
import Head from "next/head";

export const LandingPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>SweepEase.</title>
      </Head>
      <div className="bg-white dark:bg-gray-900">
        <Navbar />
        <HeroSection />
        <PricingSection />
      </div>
    </>
  );
};
