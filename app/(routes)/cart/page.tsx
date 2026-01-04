import { CartComp } from "./_components/cart.comp";
import { HeroComp } from "./_components/hero.comp";

export default function Cart() {
  return (
    <div className="flex-1 overflow-x-clip">
      <HeroComp />
      <CartComp />
    </div>
  );
}
