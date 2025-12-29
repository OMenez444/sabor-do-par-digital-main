import React from "react";
import { Order, OrderStatus } from "@/data/orders";
import OrderCard from "./OrderCard";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  title: string;
  status: OrderStatus;
  orders: Order[];
  onMoveOrder: (orderId: string, newStatus: OrderStatus) => void;
  actionLabel?: string;
  nextStatus?: OrderStatus;
  headerColor: string;
  icon: React.ReactNode;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  status,
  orders,
  onMoveOrder,
  actionLabel,
  nextStatus,
  headerColor,
  icon,
}) => {
  return (
    <div className="flex flex-col h-full min-w-[320px] md:min-w-0">
      {/* Header */}
      <div
        className={cn(
          "flex items-center gap-3 p-4 rounded-t-2xl",
          headerColor
        )}
      >
        {icon}
        <div className="flex-1">
          <h2 className="font-bold text-lg">{title}</h2>
        </div>
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-background/20 font-bold">
          {orders.length}
        </span>
      </div>

      {/* Orders */}
      <div className="flex-1 p-3 bg-muted/30 rounded-b-2xl overflow-y-auto space-y-3">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground/60">
            <p className="text-sm">Nenhum pedido</p>
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onMoveNext={
                nextStatus
                  ? () => onMoveOrder(order.id, nextStatus)
                  : undefined
              }
              actionLabel={actionLabel}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
