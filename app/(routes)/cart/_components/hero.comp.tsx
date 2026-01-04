import { Container } from "@/components/shared/container";

export const HeroComp = () => {
  return (
    <div className="py-24 lg:py-32">
      <Container size="sm" className="text-center">
        <div className="py-16">
          <span className="mb-2 block text-[10px] tracking-[0.4em] uppercase opacity-40 md:mb-4">
            Review
          </span>
          <h2 className="text-foreground">Your Selection</h2>
        </div>
      </Container>
    </div>
  );
};
