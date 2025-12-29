import { HeroComp } from "./_components/hero.comp";
import { HeritageComp } from "./_components/heritage.comp";
import { ServicesComp } from "./_components/services.comp";
import { LookbookComp } from "./_components/lookbook.comp";
import { CATComp } from "./_components/cta.comp";
import { CollectionComp } from "./_components/collection.comp";

export default function Home() {
  return (
    <div className="flex-1 overflow-x-clip">
      <HeroComp />
      <HeritageComp />
      <CollectionComp />
      <ServicesComp />
      <LookbookComp />
      <CATComp />
    </div>
  );
}
