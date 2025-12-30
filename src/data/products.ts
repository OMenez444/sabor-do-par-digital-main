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
  { id: "bebidas", name: "Bebidas", icon: "🥤" },
  { id: "porcoes", name: "Porções", icon: "🍟" },
  { id: "sobremesas", name: "Sobremesas", icon: "🍰" },
];

export const initialProducts: Product[] = [
  // Lanches
  {
    id: "1",
    name: "X-Burguer Especial",
    description: "Hambúrguer artesanal 180g, queijo cheddar, bacon crocante e molho especial",
    price: 28.90,
    category: "lanches",
    available: true,
  },
  {
    id: "2",
    name: "X-Tudo Paraense",
    description: "Hambúrguer 200g, queijo, presunto, ovo, bacon, alface, tomate e tucupi",
    price: 35.90,
    category: "lanches",
    available: true,
  },
  {
    id: "3",
    name: "Sanduíche de Filé",
    description: "Filé mignon grelhado, queijo provolone derretido e cebola caramelizada",
    price: 32.90,
    category: "lanches",
    available: true,
  },
  {
    id: "4",
    name: "X-Salada",
    description: "Hambúrguer 150g, queijo, alface, tomate e maionese caseira",
    price: 22.90,
    category: "lanches",
    available: true,
  },
  // Bebidas
  {
    id: "5",
    name: "Suco de Açaí",
    description: "Suco natural de açaí da região, 400ml",
    price: 12.90,
    category: "bebidas",
    available: true,
  },
  {
    id: "6",
    name: "Guaraná Jesus",
    description: "Refrigerante regional, lata 350ml",
    price: 6.90,
    category: "bebidas",
    available: true,
  },
  {
    id: "7",
    name: "Refrigerante",
    description: "Coca-Cola, Guaraná ou Fanta - Lata 350ml",
    price: 5.90,
    category: "bebidas",
    available: true,
  },
  {
    id: "8",
    name: "Água Mineral",
    description: "Água mineral sem gás 500ml",
    price: 3.90,
    category: "bebidas",
    available: true,
  },
  // Porções
  {
    id: "9",
    name: "Batata Frita",
    description: "Porção generosa de batata frita crocante com sal e orégano",
    price: 18.90,
    category: "porcoes",
    available: true,
  },
  {
    id: "10",
    name: "Mandioca Frita",
    description: "Mandioca frita sequinha, típica da região",
    price: 16.90,
    category: "porcoes",
    available: true,
  },
  {
    id: "11",
    name: "Onion Rings",
    description: "Anéis de cebola empanados e fritos",
    price: 19.90,
    category: "porcoes",
    available: true,
  },
  {
    id: "12",
    name: "Mix de Petiscos",
    description: "Batata, mandioca e onion rings",
    price: 32.90,
    category: "porcoes",
    available: true,
  },
  // Sobremesas
  {
    id: "13",
    name: "Pudim de Cupuaçu",
    description: "Pudim cremoso de cupuaçu com calda de caramelo",
    price: 14.90,
    category: "sobremesas",
    available: true,
  },
  {
    id: "14",
    name: "Açaí na Tigela",
    description: "Açaí batido com banana, granola, leite em pó e mel",
    price: 18.90,
    category: "sobremesas",
    available: true,
  },
  {
    id: "15",
    name: "Brownie com Sorvete",
    description: "Brownie de chocolate quente com sorvete de creme",
    price: 16.90,
    category: "sobremesas",
    available: true,
  },
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

  // Se nao tiver produtos, seedar com os iniciais
  if (data.length === 0) {
    return await seedProducts();
  }

  return data;
};

export const seedProducts = async (): Promise<Product[]> => {
  console.log("Seeding initial products...");
  // Remove IDs fixos para deixar o banco gerar UUIDs novos ou usa os fixos se forem validos UUIDs?
  // O initialProducts tem IDs numéricos 1, 2... O banco espera UUID. Vamos remover o ID.
  const toInsert = initialProducts.map(({ id, ...rest }) => rest);

  const { data, error } = await supabase
    .from("products")
    .insert(toInsert)
    .select();

  if (error) {
    console.error("Error seeding products:", error);
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
