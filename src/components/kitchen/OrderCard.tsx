import React from "react";
import { Order } from "@/data/orders";
import { Clock, ChefHat, CheckCircle, ArrowRight, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderCardProps {
  order: Order;
  onMoveNext?: () => void;
  actionLabel?: string;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onMoveNext, actionLabel }) => {
  const createdDate = new Date(order.created_at);

  const formatTime = (d: Date | string) => {
    const date = typeof d === "string" ? new Date(d) : d;
    if (isNaN(date.getTime())) return "--:--";
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getTimeSince = (d: Date | string) => {
    const date = typeof d === "string" ? new Date(d) : d;
    if (isNaN(date.getTime())) return "-";
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return "Agora";
    if (minutes === 1) return "1 min";
    return `${minutes} min`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const getStatusConfig = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return {
          icon: Clock,
          bgColor: "bg-warning/10",
          borderColor: "border-warning/30",
          iconColor: "text-warning",
          pulse: true,
        };
      case "preparing":
        return {
          icon: ChefHat,
          bgColor: "bg-info/10",
          borderColor: "border-info/30",
          iconColor: "text-info",
          pulse: false,
        };
      case "ready":
        return {
          icon: CheckCircle,
          bgColor: "bg-success/10",
          borderColor: "border-success/30",
          iconColor: "text-success",
          pulse: false,
        };
      default:
        return {
          icon: Clock,
          bgColor: "bg-muted/10",
          borderColor: "border-border",
          iconColor: "text-muted-foreground",
          pulse: false,
        };
    }
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  // Extract Customer Info if any
  const customerInfoItem = order.items.find(i => i.product.id === "meta-customer-info");
  const customerInfo = customerInfoItem?.customerInfo;

  // Products to show (exclude meta items)
  const displayItems = order.items.filter(i => i.product.category !== "meta");

  const isTable = !isNaN(Number(order.table_number));
  const tableDisplay = isTable
    ? order.table_number?.toString().padStart(2, "0")
    : "R"; // R de Remoto/Retirada

  return (
    <div
      className={cn(
        "rounded-2xl border-2 overflow-hidden transition-all duration-300 hover:shadow-brand",
        statusConfig.bgColor,
        statusConfig.borderColor
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground font-bold text-lg",
                statusConfig.pulse && "animate-pulse-soft"
              )}
            >
              {tableDisplay}
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg">
                {isTable ? `Mesa ${order.table_number || "?"}` : (customerInfo?.name || order.table_number)}
              </h3>
              <p className="text-sm text-muted-foreground">
                Pedido #{order.id.slice(0, 8)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <StatusIcon className={cn("w-5 h-5", statusConfig.iconColor)} />
            <span className="text-sm font-medium">{getTimeSince(createdDate)}</span>
          </div>
        </div>
      </div>

      {/* Customer Details for Remote Orders */}
      {customerInfo && (
        <div className="px-4 py-2 bg-background border-b border-border/50 text-sm space-y-1">
          <div className="font-semibold text-foreground">Entrega para:</div>
          <div className="grid grid-cols-[20px_1fr] gap-1 items-start text-muted-foreground">
            <span>👤</span> <span className="text-foreground">{customerInfo.name}</span>
            <span>📞</span> <span>{customerInfo.phone}</span>
            <span>📍</span> <span className="break-words">{customerInfo.address}</span>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="p-4">
        <ul className="space-y-2">
          {displayItems.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-sm">
                {item.quantity}x
              </span>
              <div className="flex-1">
                <span className="font-medium text-foreground">{item.product.name}</span>
                <div className="text-sm text-muted-foreground">
                  {formatPrice(item.product.price * item.quantity)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {formatTime(createdDate)}
          </div>
          <span className="font-bold text-foreground">
            {formatPrice(order.total)}
          </span>
        </div>

        {onMoveNext && actionLabel && (
          <button
            onClick={onMoveNext}
            className={cn(
              "w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all",
              order.status === "pending" && "bg-primary text-primary-foreground hover:opacity-90",
              order.status === "preparing" && "bg-success text-success-foreground hover:opacity-90",
              order.status === "ready" && "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {order.status === "pending" && <Utensils className="w-5 h-5" />}
            {order.status === "preparing" && <CheckCircle className="w-5 h-5" />}
            <span>{actionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
