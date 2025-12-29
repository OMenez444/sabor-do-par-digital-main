import React from "react";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const { items, addItem, updateQuantity } = useCart();
  
  const cartItem = items.find((item) => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <div
      className={cn(
        "bg-card rounded-2xl border border-border shadow-brand-sm overflow-hidden transition-all duration-300 hover:shadow-brand hover:border-primary/30",
        "animate-fade-in"
      )}
      style={{ animationDelay: `${index * 75}ms` }}
    >
      <div className="p-4">
        <div className="flex justify-between items-start gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-muted/20 flex-shrink-0" />
            )}

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground text-base leading-tight mb-1">
                {product.name}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                {product.description}
              </p>
              <p className="text-primary font-extrabold text-lg">
                {formatPrice(product.price)}
              </p>
            </div>
          </div>

          <div className="flex-shrink-0">
            {quantity === 0 ? (
              <button
                onClick={() => addItem(product)}
                className="flex items-center justify-center w-14 h-14 sm:w-12 sm:h-12 rounded-xl bg-primary text-primary-foreground shadow-glow transition-all duration-200 hover:scale-105 active:scale-95 touch-target"
                aria-label={`Adicionar ${product.name}`}
              >
                <Plus className="w-6 h-6" />
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-primary/10 rounded-xl p-1">
                <button
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 rounded-lg bg-card text-foreground border border-border transition-all hover:border-primary/50 touch-target"
                  aria-label="Remover um"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold text-foreground">
                  {quantity}
                </span>
                <button
                  onClick={() => addItem(product)}
                  className="flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 rounded-lg bg-primary text-primary-foreground transition-all hover:opacity-90 touch-target"
                  aria-label="Adicionar mais um"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
