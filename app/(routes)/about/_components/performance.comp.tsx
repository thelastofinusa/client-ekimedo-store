import { Container } from "@/components/shared/container";

export const PerformanceComp = () => {
  return (
    <div className="bg-foreground text-background py-24 lg:py-32">
      <Container>
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-10 lg:gap-16 xl:gap-24">
          <h2 className="leading-none uppercase">
            A Philosophy <br /> of <span className="italic">Permanence</span>
          </h2>
          <div className="flex flex-col gap-6 md:gap-12">
            {[
              {
                number: "01",
                title: "Artistry",
                text: "Transcending trends through timeless design and sculptural form.",
              },
              {
                number: "02",
                title: "Precision",
                text: "Every measurement and stitch executed with uncompromising detail.",
              },
              {
                number: "03",
                title: "Elegance",
                text: "The quiet confidence found in perfectly tailored simplicity.",
              },
            ].map((v) => (
              <div
                key={v.title}
                className="group border-border/20 flex gap-8 border-t pt-8"
              >
                <span className="text-muted-foreground font-mono text-sm">
                  {v.number}
                </span>
                <div className="space-y-2">
                  <h4 className="text-xl uppercase italic md:text-2xl">
                    {v.title}
                  </h4>
                  <p className="max-w-sm text-sm tracking-wide opacity-60">
                    {v.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};
