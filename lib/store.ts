import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { storage } from "@/lib/storage";

interface CartItem {
  dress: {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    // Optional metadata used in some UIs
    priceRange?: string;
    deliveryTime?: string;
  };
  selectedSize: string | number;
  // Optional color selection; not all flows set this yet
  selectedColor?: string;
  quantity: number;
}

interface AppStoreProps {
  cart: CartItem[];
  // ACTIONS
  addToCart: (item: CartItem) => void;
  removeFromCart: (dressId: string, size: string | number, color?: string) => void;
  clearCart: () => void;
}

export const useAppStore = create<AppStoreProps>()(
  persist(
    (set) => ({
      cart: [],
      addToCart: (newItem: CartItem) =>
        set((state) => {
          const existingItemIndex = state.cart.findIndex(
            (item) =>
              item.dress.id === newItem.dress.id &&
              item.selectedSize === newItem.selectedSize &&
              item.selectedColor === newItem.selectedColor
          );

          if (existingItemIndex > -1) {
            const updatedCart = [...state.cart];
            updatedCart[existingItemIndex].quantity += newItem.quantity;
            return { cart: updatedCart };
          }

          return {
            cart: [...state.cart, newItem],
          };
        }),
      removeFromCart: (dressId: string, size: string | number, color?: string) =>
        set((state) => ({
          cart: state.cart.filter(
            (item) =>
              !(
                item.dress.id === dressId &&
                item.selectedSize === size &&
                item.selectedColor === color
              )
          ),
        })),
      clearCart: () =>
        set(() => ({
          cart: [],
        })),
    }),
    {
      name: "ekimedo-cart-storage",
      storage: createJSONStorage(() => storage),
    }
  )
);
