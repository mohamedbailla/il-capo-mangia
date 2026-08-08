import Navigation from "@/components/restaurant/Navigation";
import HeroSection from "@/components/restaurant/HeroSection";
import AboutSection from "@/components/restaurant/AboutSection";
import MenuSection from "@/components/restaurant/MenuSection";
import GallerySection from "@/components/restaurant/GallerySection";
import TestimonialsSection from "@/components/restaurant/TestimonialsSection";
import ReservationSection from "@/components/restaurant/ReservationSection";
import LocationSection from "@/components/restaurant/LocationSection";
import ContactSection from "@/components/restaurant/ContactSection";
import Footer from "@/components/restaurant/Footer";

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--dark-bg)" }}>
      <Navigation />
      <HeroSection />
      <AboutSection />
      <MenuSection />
      <GallerySection />
      <TestimonialsSection />
      <ReservationSection />
      <LocationSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
