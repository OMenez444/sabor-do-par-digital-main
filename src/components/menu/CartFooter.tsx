import React from "react";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface CartFooterProps {
  onViewCart: () => void;
}

const CartFooter: React.FC<CartFooterProps> = ({ onViewCart }) => {
  const { totalItems, totalAmount } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="container pb-4 pt-2">
        <button
          onClick={onViewCart}
          className={cn(
            "w-full flex items-center justify-between gap-4 px-5 py-4 rounded-2xl",
            "bg-primary text-primary-foreground shadow-glow",
            "transition-all duration-300 hover:opacity-95 active:scale-[0.98]"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingBag className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs font-bold">
                {totalItems}
              </span>
            </div>
            <span className="font-semibold">Ver Sacola</span>
          </div>
          <span className="font-bold text-lg">{formatPrice(totalAmount)}</span>
        </button>
      </div>
    </div>
  );
};

export default CartFooter;
