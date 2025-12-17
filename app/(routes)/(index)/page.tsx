import { CTA } from "./_components/cta";
import { FAQs } from "./_components/faqs";

export default function Home() {
  return (
    <div className="flex-1 overflow-x-clip">
      <FAQs />
      <CTA />
      {/* <Container>
        <p className="font-sans uppercase">Font Sans</p>
        <p className="font-sans">Font Sans</p>
        <p className="font-serif uppercase">Font Serif</p>
        <p className="font-serif">Font Serif</p>
        <p className="font-mono uppercase">Font Mono</p>
        <p className="font-mono">Font Mono</p>
      </Container> */}
    </div>
  );
}
