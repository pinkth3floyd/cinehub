import {
  Header,
  HeroCarousel,
  ContentTabs,
  PremiereSection,
  PricingSection,
  PlanModal,
  Footer
} from './core/ui';

export default function Home() {
  return (
    <>
      <Header />
      <HeroCarousel />
      <ContentTabs />
      <PremiereSection />
      <PricingSection />
      <Footer />
      <PlanModal />
    </>
  );
}
