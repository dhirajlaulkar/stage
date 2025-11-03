import { Navigation } from "./Navigation";
import { Hero } from "./Hero";
import { Features } from "./Features";
import { Footer } from "./Footer";

interface Feature {
  title: string;
  description: string;
}

interface LandingPageProps {
  heroTitle: string;
  heroSubtitle?: string;
  heroDescription: string;
  ctaLabel?: string;
  ctaHref?: string;
  features: Feature[];
  featuresTitle?: string;
  brandName?: string;
  footerText?: string;
}

export function LandingPage({
  heroTitle,
  heroSubtitle,
  heroDescription,
  ctaLabel = "Get Started",
  ctaHref = "/home",
  features,
  featuresTitle,
  brandName = "Stage",
  footerText = "Built with Next.js and Konva.",
}: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation ctaLabel="Editor" ctaHref={ctaHref} />
      <Hero
        title={heroTitle}
        subtitle={heroSubtitle}
        description={heroDescription}
        ctaLabel={ctaLabel}
        ctaHref={ctaHref}
      />
      <Features features={features} title={featuresTitle} />
      <Footer brandName={brandName} additionalText={footerText} />
    </div>
  );
}

