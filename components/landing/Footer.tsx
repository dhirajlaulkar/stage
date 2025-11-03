interface FooterProps {
  brandName?: string;
  additionalText?: string;
}

export function Footer({ 
  brandName = "Stage", 
  additionalText = "Built with Next.js and Konva." 
}: FooterProps) {
  return (
    <footer className="w-full border-t border-border py-8">
      <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} {brandName}. {additionalText}
        </p>
      </div>
    </footer>
  );
}

