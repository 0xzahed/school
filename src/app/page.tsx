import Hero from "@/components/Hero";
import { AboutHome, PrincipalHome } from "@/components/AboutHome";
import { AcademicsHome, WhyChooseHome } from "@/components/AcademicsHome";
import { ActivitiesHome, StatsBand, EventsHome, NoticesHome } from "@/components/ActivitiesHome";
import { GalleryHome, TeachersHome, TestimonialsHome, AdmissionCTA, ContactHome } from "@/components/ShowcaseHome";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutHome />
      <PrincipalHome />
      <AcademicsHome />
      <WhyChooseHome />
      <ActivitiesHome />
      <StatsBand />
      <EventsHome />
      <NoticesHome />
      <GalleryHome />
      <TeachersHome />
      <TestimonialsHome />
      <AdmissionCTA />
      <ContactHome />
    </>
  );
}
