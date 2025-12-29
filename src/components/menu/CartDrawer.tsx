import React from "react";
import { useCart, CartItem } from "@/contexts/CartContext";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { addOrder } from "@/data/orders";
import { toast } from "sonner";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: string | null;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, tableNumber }) => {
  const { items, updateQuantity, removeItem, clearCart, totalAmount, totalItems } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleConfirmOrder = () => {
    if (items.length === 0) return;

    addOrder(items, totalAmount, tableNumber);

    toast.success("Pedido enviado para a cozinha!", {
      description: `Mesa ${tableNumber || "?"} - Total: ${formatPrice(totalAmount)}`
    });

    clearCart();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-foreground/50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 md:inset-x-0 md:bottom-0 md:max-h-[85vh] md:rounded-t-3xl bg-card shadow-brand-lg transition-transform duration-300 ease-out",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-lg font-bold text-foreground">Sua Sacola</h2>
              <p className="text-sm text-muted-foreground">
                {totalItems} {totalItems === 1 ? "item" : "itens"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Items */}
        <div className="overflow-y-auto max-h-[50vh] p-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">Sua sacola está vazia</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item: CartItem) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
                >
                  {item.product.image ? (
                    <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-muted/10 flex-shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-primary font-bold text-sm">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1.5 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-6 text-center font-semibold text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors ml-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-border space-y-3 safe-bottom">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="text-2xl font-extrabold text-foreground">
                {formatPrice(totalAmount)}
              </span>
            </div>
            <button
              onClick={handleConfirmOrder}
              className="w-full py-5 rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-glow transition-all hover:opacity-95 active:scale-[0.98] touch-target"
            >
              Confirmar Pedido
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
