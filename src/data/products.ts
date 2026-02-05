import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const categories: Category[] = [
  { id: "lanches", name: "Lanches", icon: "🍔" },
  { id: "refeicoes", name: "Espetos", icon: "🍢" },
  { id: "costela", name: "Costela e Assados", icon: "🍖" },
  { id: "porcoes", name: "Porções", icon: "🍟" },
  { id: "bebidas", name: "Bebidas", icon: "🥤" },
];

export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data || [];
};

export const addProduct = async (product: Omit<Product, "id">): Promise<Product | null> => {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) {
    console.error("Error adding product:", error);
    toast.error("Erro ao adicionar produto");
    return null;
  }
  return data;
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating product:", error);
    toast.error("Erro ao atualizar produto");
    return null;
  }
  return data;
};

export const removeProduct = async (id: string) => {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting product:", error);
    toast.error("Erro ao remover produto");
  }
};

import { SEED_PRODUCTS } from "./seed-data";

export const adminResetMenu = async () => {
  // 1. Delete all existing products
  const { error: deleteError } = await supabase
    .from("products")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (deleteError) {
    console.error("Error clearing menu:", deleteError);
    toast.error("Erro ao limpar cardápio atual");
    return;
  }

  // 2. Insert fresh seed data
  const { error: insertError } = await supabase
    .from("products")
    .insert(SEED_PRODUCTS);

  if (insertError) {
    console.error("Error seeding products:", insertError);
    toast.error("Erro ao criar novos produtos");
  } else {
    toast.success("Cardápio resetado com sucesso!");
  }
};
