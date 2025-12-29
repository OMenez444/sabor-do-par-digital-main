import { CartItem } from "@/contexts/CartContext";

export type OrderStatus = "pending" | "preparing" | "ready" | "delivered" | "canceled";

export interface Order {
  id: string;
  table: string | null;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

const STORAGE_KEY = "sabor-do-para-orders";

export const getOrders = (): Order[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to parse orders", e);
    return [];
  }
};

export const saveOrders = (orders: Order[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  // Dispatch a custom event to notify other components in the same window
  window.dispatchEvent(new Event("orders-updated"));
};

export const addOrder = (items: CartItem[], total: number, table: string | null): Order => {
  const orders = getOrders();
  const newOrder: Order = {
    id: crypto.randomUUID(),
    table,
    items,
    total,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const updatedOrders = [newOrder, ...orders];
  saveOrders(updatedOrders);
  return newOrder;
};

export const updateOrderStatus = (orderId: string, status: OrderStatus) => {
  const orders = getOrders();
  const updatedOrders = orders.map(order =>
    order.id === orderId ? { ...order, status } : order
  );
  saveOrders(updatedOrders);
};

export const closeOrdersForTable = (table: string, finalStatus: OrderStatus = "delivered") => {
  const orders = getOrders();
  const updated = orders.map(order =>
    order.table === table ? { ...order, status: finalStatus } : order
  );
  saveOrders(updated);
};

export const deleteOrdersForTable = (table: string) => {
  const orders = getOrders();
  const updated = orders.filter(order => order.table !== table);
  saveOrders(updated);
};

// Initial mock data loader (only if empty)
export const initializeMockData = () => {
  if (getOrders().length === 0) {
    const mockOrders: Order[] = [
      {
        id: "1",
        table: "05",
        items: [],
        total: 85.0,
        status: "preparing",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        table: "12",
        items: [],
        total: 42.5,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
    ];
    saveOrders(mockOrders);
  }
};
