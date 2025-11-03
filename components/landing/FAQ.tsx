"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Instrument_Serif } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
});

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  title?: string;
  faqs?: FAQItem[];
}

const defaultFAQs: FAQItem[] = [
  {
    question: "What is Stage?",
    answer:
      "Stage is a canvas editor for creating visual designs. Add images, text, backgrounds, and export in PNG or JPG formats.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "Yes, you need to sign up to access the editor. You can create an account with Google. It's free and takes just seconds.",
  },
  {
    question: "Is Stage free to use?",
    answer:
      "Yes, Stage is free to use. Create unlimited designs and export without restrictions. No credit card required.",
  },
  {
    question: "What can I export?",
    answer:
      "Export your designs as PNG (with transparency) or JPG. Adjust quality settings for JPG exports to get the perfect file size.",
  },
  {
    question: "Can I customize the canvas size?",
    answer:
      "Yes. Choose from preset sizes for Instagram, Facebook, Twitter, YouTube, or set custom dimensions for any project.",
  },
  {
    question: "What image formats can I upload?",
    answer:
      "Stage supports PNG, JPG, JPEG, and WEBP formats. Maximum file size is 10MB per image.",
  },
];

export function FAQ({ title = "Frequently Asked Questions", faqs = defaultFAQs }: FAQProps) {
  return (
    <section className="w-full py-12 sm:py-16 px-4 sm:px-6 border-t border-border bg-muted/30">
      <div className="container mx-auto max-w-3xl">
        <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 ${instrumentSerif.className}`}>
          {title}
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-border">
              <AccordionTrigger className="text-left text-base sm:text-sm font-semibold py-4 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

