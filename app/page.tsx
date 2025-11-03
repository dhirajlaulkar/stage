import { LandingPage } from "@/components/landing/LandingPage";

const features = [
  {
    title: "Interactive Canvas",
    description:
      "Drag, resize, and transform objects with intuitive controls",
  },
  {
    title: "Rich Customization",
    description:
      "Add images, text, gradients, and custom backgrounds",
  },
  {
    title: "Export Options",
    description:
      "Download your designs in PNG or JPG at full resolution",
  },
];

export default function Home() {
  return (
    <LandingPage
      heroTitle="Create stunning designs"
      heroSubtitle="with ease"
      heroDescription="A modern canvas editor for adding images, text, and backgrounds. Export your creations in high quality."
      ctaLabel="Get Started"
      ctaHref="/home"
      features={features}
    />
  );
}
