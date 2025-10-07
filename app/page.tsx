import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { PricingSection } from '@/components/landing/pricing-section'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
    </main>
  )
}