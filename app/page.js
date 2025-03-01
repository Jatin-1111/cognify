"use client";
import Image from "next/image";
import HeroSection from "./components/Home/HeroSection";
import FeaturedCourses from "./components/Home/FeaturedCourses";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturedCourses />
    </div>
  );
}
