import { supabase } from "@/lib/supabase";
import { CartItem, CustomerInfo } from "@/contexts/CartContext";

export type OrderStatus = "pending" | "preparing" | "ready" | "delivered" | "canceled" | "archived";

export interface Order {
  id: string; // uuid
  table_number: string | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  customer_address?: string | null;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  created_at: string;
}

// Mapeamento para o formato do banco (snake_case)
interface OrderDB {
  id: string;
  table_number: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_address: string | null;
  items: any; // jsonb
  total: number;
  status: string;
  created_at: string;
}

export const getOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .neq("status", "archived")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  return data.map((o: OrderDB) => ({
    id: o.id,
    table_number: o.table_number,
    customer_name: o.customer_name,
    customer_phone: o.customer_phone,
    customer_address: o.customer_address,
    items: o.items as CartItem[],
    total: o.total,
    status: o.status as OrderStatus,
    created_at: o.created_at,
  }));
};

export const getArchivedOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("status", "archived")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching archived orders:", error);
    return [];
  }

  return data.map((o: OrderDB) => ({
    id: o.id,
    table_number: o.table_number,
    items: o.items as CartItem[],
    total: o.total,
    status: o.status as OrderStatus,
    created_at: o.created_at,
  }));
};

export const archiveAllReadyOrders = async () => {
  // Archives all orders that are 'ready' or 'delivered'
  const { error } = await supabase
    .from("orders")
    .update({ status: "archived" })
    .in("status", ["ready", "delivered"]);

  if (error) {
    console.error("Error archiving orders:", error);
  }
};

export const addOrder = async (
  items: CartItem[],
  total: number,
  tableNumber: string | null,
  customerInfo?: CustomerInfo
): Promise<Order | null> => {

  const { data, error } = await supabase
    .from("orders")
    .insert({
      table_number: tableNumber,
      customer_name: customerInfo?.name || null,
      customer_phone: customerInfo?.phone || null,
      customer_address: customerInfo?.address || null,
      total,
      status: "pending",
      items: items,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding order:", error);
    return null;
  }

  return {
    id: data.id,
    table_number: data.table_number,
    customer_name: data.customer_name,
    customer_phone: data.customer_phone,
    customer_address: data.customer_address,
    items: data.items as CartItem[],
    total: data.total,
    status: data.status as OrderStatus,
    created_at: data.created_at,
  };
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    console.error("Error updating order:", error);
  }
};

export const closeOrdersForTable = async (tableNumber: string, finalStatus: OrderStatus = "delivered") => {
  const { error } = await supabase
    .from("orders")
    .update({ status: finalStatus })
    .eq("table_number", tableNumber)
    .neq("status", "archived");

  if (error) {
    console.error("Error closing orders for table:", error);
  }
};

export const deleteOrdersForTable = async (tableNumber: string) => {
  const { error } = await supabase
    .from("orders")
    .delete()
    .eq("table_number", tableNumber);

  if (error) {
    console.error("Error deleting orders:", error);
  }
};

// Initial mock data is no longer needed for Supabase
export const initializeMockData = () => { };
