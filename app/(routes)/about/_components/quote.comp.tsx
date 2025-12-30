import { Container } from "@/components/shared/container";

export const QuoteComp = () => {
  return (
    <div className="from-background py-24 text-center lg:py-32">
      <Container className="space-y-12" size="xs">
        <div className="bg-foreground mx-auto h-10 w-px opacity-20" />
        <blockquote className="font-serif text-3xl leading-tight italic md:text-5xl lg:text-6xl">
          &quot;We don&apos;t just make dresses; we craft the artifacts of your
          life&apos;s most beautiful stories.&quot;
        </blockquote>
        <p className="text-muted-foreground text-[10px] tracking-[0.4em] uppercase">
          — The Maison Atelier
        </p>
      </Container>
    </div>
  );
};
