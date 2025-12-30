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

  // State for remote customer details
  const [remoteName, setRemoteName] = React.useState("");
  const [remotePhone, setRemotePhone] = React.useState("");
  const [remoteAddress, setRemoteAddress] = React.useState("");

  // Address search state
  const [addressQuery, setAddressQuery] = React.useState("");
  const [addressToSelect, setAddressToSelect] = React.useState<any[]>([]);
  const [isSearchingAddress, setIsSearchingAddress] = React.useState(false);
  const searchTimeoutRef = React.useRef<any>(null);

  const handleSearchAddress = (query: string) => {
    setAddressQuery(query);
    setRemoteAddress(query); // Allow manual typing

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (query.length < 5) {
      setAddressToSelect([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearchingAddress(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
        const data = await res.json();
        setAddressToSelect(data);
      } catch (e) {
        console.error("Address search failed", e);
      } finally {
        setIsSearchingAddress(false);
      }
    }, 1000); // 1s debounce
  };

  const selectAddress = (addr: any) => {
    setRemoteAddress(addr.display_name);
    setAddressQuery(addr.display_name);
    setAddressToSelect([]);
  };

  const handleConfirmOrder = async () => {
    if (items.length === 0) return;

    // Se não tem mesa, exige dados completos
    if (!tableNumber) {
      if (!remoteName.trim() || !remotePhone.trim() || !remoteAddress.trim()) {
        toast.error("Por favor, preencha Nome, Telefone e Endereço para entrega.");
        return;
      }
    }

    try {
      const customerInfo = !tableNumber ? {
        name: remoteName,
        phone: remotePhone,
        address: remoteAddress
      } : undefined;

      // Use name as identifier if remote
      const identifier = tableNumber || remoteName;

      await addOrder(items, totalAmount, tableNumber, customerInfo);

      toast.success("Pedido enviado para a cozinha!", {
        description: `${tableNumber ? `Mesa ${tableNumber}` : `Cliente: ${identifier}`} - Total: ${formatPrice(totalAmount)}`
      });

      clearCart();
      setRemoteName("");
      setRemotePhone("");
      setRemoteAddress("");
      setAddressQuery("");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao enviar pedido");
    }
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
          "fixed inset-0 z-50 md:inset-x-0 md:bottom-0 md:max-h-[85vh] md:rounded-t-3xl bg-card shadow-brand-lg transition-transform duration-300 ease-out flex flex-col",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-lg font-bold text-foreground mx-1">Sua Sacola</h2>
              <p className="text-sm text-muted-foreground mx-1">
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
        <div className="overflow-y-auto p-4 flex-1">
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
          <div className="p-4 border-t border-border space-y-3 safe-bottom bg-card flex-shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="text-2xl font-extrabold text-foreground">
                {formatPrice(totalAmount)}
              </span>
            </div>

            {/* Input Dados para Cliente Remoto */}
            {!tableNumber && (
              <div className="space-y-3 pt-2 bg-muted/20 p-3 rounded-xl border border-border">
                <h3 className="font-bold text-sm text-foreground">Dados para Entrega</h3>

                <div className="space-y-1">
                  <input
                    type="text"
                    value={remoteName}
                    onChange={(e) => setRemoteName(e.target.value)}
                    placeholder="Nome Completo *"
                    className="w-full p-3 rounded-lg border border-border bg-background text-sm outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <input
                    type="tel"
                    value={remotePhone}
                    onChange={(e) => setRemotePhone(e.target.value)}
                    placeholder="Telefone/WhatsApp *"
                    className="w-full p-3 rounded-lg border border-border bg-background text-sm outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1 relative">
                  <input
                    type="text"
                    value={addressQuery}
                    onChange={(e) => handleSearchAddress(e.target.value)}
                    placeholder="Buscar Endereço (Rua, Bairro...)"
                    className="w-full p-3 rounded-lg border border-border bg-background text-sm outline-none focus:ring-1 focus:ring-primary"
                  />
                  {isSearchingAddress && <span className="absolute right-3 top-3 text-xs text-muted-foreground animate-pulse">Buscando...</span>}

                  {/* Lista de sugestões */}
                  {addressToSelect.length > 0 && (
                    <div className="absolute bottom-full left-0 w-full mb-1 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto">
                      {addressToSelect.map((addr: any, i) => (
                        <div
                          key={i}
                          onClick={() => selectAddress(addr)}
                          className="p-2 text-xs hover:bg-muted cursor-pointer border-b border-border/50 last:border-0"
                        >
                          {addr.display_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

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
