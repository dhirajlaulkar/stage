interface Feature {
  title: string;
  description: string;
}

interface FeaturesProps {
  features: Feature[];
  title?: string;
}

export function Features({ features, title }: FeaturesProps) {
  return (
    <section className="w-full py-16 px-6 border-t border-border">
      <div className="container mx-auto max-w-6xl">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
        )}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="space-y-2">
              <h3 className="font-semibold text-lg">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

