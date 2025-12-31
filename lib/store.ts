import { create } from "zustand";

interface CartItem {
  dress: {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
  };
  selectedSize: string | number;
  quantity: number;
}

interface AppStoreProps {
  cart: CartItem[];
  // ACTIONS
  addToCart: (item: CartItem) => void;
  removeFromCart: (dressId: string) => void;
  clearCart: () => void;
}

export const useAppStore = create<AppStoreProps>((setFn) => ({
  cart: [],
  addToCart: (item: CartItem) =>
    setFn((state: AppStoreProps) => ({
      cart: [...state.cart, item],
    })),
  removeFromCart: (dressId: string) =>
    setFn((state: AppStoreProps) => ({
      cart: state.cart.filter((item) => item.dress.id !== dressId),
    })),
  clearCart: () =>
    setFn(() => ({
      cart: [],
    })),
}));

// interface ConsultationForm {
//   category: string;
//   inspirationImages: string[];
//   description: string;
//   currentStep: number;
// }

// interface AppState {
//   currentSlide: number;
//   setSlide: (index: number) => void;
//   totalSlides: number;
//   cart: CartItem[];
//   addToCart: (item: CartItem) => void;
//   removeFromCart: (dressId: string) => void;
//   consultation: ConsultationForm;
//   updateConsultation: (data: Partial<ConsultationForm>) => void;
// }

// export const useStore = create<AppState>((set) => ({
//   currentSlide: 0,
//   totalSlides: 3,
//   setSlide: (index) => set({ currentSlide: index }),
//   cart: [],
//   addToCart: (item) =>
//     set((state) => ({
//       cart: [...state.cart, item],
//     })),
//   removeFromCart: (dressId) =>
//     set((state) => ({
//       cart: state.cart.filter((item) => item.dress.id !== dressId),
//     })),
//   consultation: {
//     category: "bridal",
//     inspirationImages: [],
//     description: "",
//     currentStep: 1,
//   },
//   updateConsultation: (data) =>
//     set((state) => ({
//       consultation: { ...state.consultation, ...data },
//     })),
// }));
