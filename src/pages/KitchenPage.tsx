import React, { useState, useEffect } from "react";
import { Order, OrderStatus, getOrders, updateOrderStatus, archiveAllReadyOrders } from "@/data/orders";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import KitchenHeader from "@/components/kitchen/KitchenHeader";
import KanbanColumn from "@/components/kitchen/KanbanColumn";
import { Clock, ChefHat, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const KitchenPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();
  // Drawer removed: now managed in a separate page (/admin/mesas) opened in a new tab

  useEffect(() => {
    // 1. Initial Load
    const loadOrders = async () => {
      const data = await getOrders();
      setOrders(data);
    };
    loadOrders();

    // 2. Realtime Subscription
    const channel = supabase
      .channel('kitchen-orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          // Simplest approach: reload all on any change
          // For optimization we could manually update the state based on payload
          console.log('Realtime update:', payload);

          // Se for novo pedido (INSERT), tocar som e mostrar alerta
          if (payload.eventType === 'INSERT') {
            const newOrder = payload.new as Order;

            // Tocar som (efeito de sino/notificação)
            try {
              const audio = new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_c8c8a73467.mp3"); // Notification sound
              audio.play().catch(e => console.error("Erro ao tocar som:", e));
            } catch (e) {
              console.error("Audio error", e);
            }

            // Mostrar Popup (Toast)
            toast("🔔 NOVO PEDIDO CHEGOU!", {
              description: `Mesa: ${newOrder.table_number || 'Delivery'} - R$ ${newOrder.total}`,
              duration: 10000,
              action: {
                label: "Atualizar",
                onClick: () => loadOrders()
              },
              style: {
                backgroundColor: "#f59e0b", // Amber/Warning color
                color: "black",
                fontSize: "1.1rem",
                fontWeight: "bold"
              }
            });
          }

          loadOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleMoveOrder = async (orderId: string, newStatus: OrderStatus) => {
    // Optimistic update
    setOrders(current => current.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    await updateOrderStatus(orderId, newStatus);
  };

  const handleRefresh = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  const handleFinalize = async () => {
    const pendencias = orders.filter(o => o.status === 'pending' || o.status === 'preparing');
    if (pendencias.length > 0) {
      if (!confirm(`Atenção: Existem ${pendencias.length} pedidos pendentes/em preparo. Eles NÃO serão arquivados. Deseja continuar e arquivar apenas os Prontos/Entregues?`)) {
        return;
      }
    } else {
      if (!confirm("Tem certeza que deseja finalizar o expediente? Isso moverá todos os pedidos prontos para o histórico.")) return;
    }

    await archiveAllReadyOrders();

    // Refresh to clear screen
    await handleRefresh();

    // Open reports
    window.open('/admin/relatorios', '_blank');
  };

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const preparingOrders = orders.filter((o) => o.status === "preparing");
  const readyOrders = orders.filter((o) => o.status === "ready");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <KitchenHeader onRefresh={handleRefresh} onFinalize={handleFinalize} />

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
