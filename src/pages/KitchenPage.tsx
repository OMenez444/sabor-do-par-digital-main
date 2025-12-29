import React, { useState, useEffect } from "react";
import { Order, OrderStatus, getOrders, updateOrderStatus } from "@/data/orders";
import KitchenHeader from "@/components/kitchen/KitchenHeader";
import KanbanColumn from "@/components/kitchen/KanbanColumn";
import { Clock, ChefHat, CheckCircle } from "lucide-react";

const KitchenPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  // Drawer removed: now managed in a separate page (/admin/mesas) opened in a new tab

  useEffect(() => {
    // Initial load
    setOrders(getOrders());

    // Listen for updates from this window
    const handleLocalUpdate = () => setOrders(getOrders());
    window.addEventListener("orders-updated", handleLocalUpdate);

    // Listen for updates from other tabs
    const handleStorageUpdate = (e: StorageEvent) => {
      if (e.key === "sabor-do-para-orders") {
        setOrders(getOrders());
      }
    };
    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      window.removeEventListener("orders-updated", handleLocalUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

  const handleMoveOrder = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleRefresh = () => {
    setOrders(getOrders());
  };

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const preparingOrders = orders.filter((o) => o.status === "preparing");
  const readyOrders = orders.filter((o) => o.status === "ready");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <KitchenHeader onRefresh={handleRefresh} />

      <main className="flex-1 container py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-140px)]">
          <KanbanColumn
            title="Novos Pedidos"
            status="pending"
            orders={pendingOrders}
            onMoveOrder={handleMoveOrder}
            actionLabel="Aceitar Pedido"
            nextStatus="preparing"
            headerColor="bg-warning text-warning-foreground"
            icon={<Clock className="w-6 h-6" />}
          />

          <KanbanColumn
            title="Em Preparo"
            status="preparing"
            orders={preparingOrders}
            onMoveOrder={handleMoveOrder}
            actionLabel="Marcar como Pronto"
            nextStatus="ready"
            headerColor="bg-info text-info-foreground"
            icon={<ChefHat className="w-6 h-6" />}
          />

          <KanbanColumn
            title="Prontos / Entregues"
            status="ready"
            orders={readyOrders}
            onMoveOrder={handleMoveOrder}
            headerColor="bg-success text-success-foreground"
            icon={<CheckCircle className="w-6 h-6" />}
          />
        </div>
      </main>


    </div>
  );
};

export default KitchenPage;
