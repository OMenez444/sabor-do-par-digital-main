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

export const initialProducts: Product[] = [
  // Lanches
  {
    id: "1",
    name: "Parazinho",
    description: "Pão brioche, Smash búrguer artesanal de 90g, queijo cheddar e molho do chef",
    price: 15.00,
    category: "lanches",
    available: true,
  },
  {
    id: "2",
    name: "Saladinha",
    description: "Pão brioche, Smash búrguer artesanal 90g, queijo cheddar, molho do chef, alface e tomate",
    price: 20.00,
    category: "lanches",
    available: true,
  },
  {
    id: "3",
    name: "Duplo",
    description: "Pão brioche, 2 Smash búrguer artesanal de 90g, 2 queijo cheddar e molho do chef",
    price: 25.00,
    category: "lanches",
    available: true,
  },
  {
    id: "4",
    name: "Hambúrguer do Pará",
    description: "Pão brioche, 90g de costela desfiada, Hambúrguer artesanal de 90g, queijo cheddar e molho do chef",
    price: 35.00,
    category: "lanches",
    available: true,
  },
  {
    id: "5",
    name: "Hambúrguer do Sertão",
    description: "Pão brioche, 90g de Carne seca desfiada, Hambúrguer artesanal de 90g, queijo cheddar e molho do chef",
    price: 35.00,
    category: "lanches",
    available: true,
  },
  {
    id: "6",
    name: "Franbacon",
    description: "Pão brioche, Hambúrguer artesanal de frango 120g, queijo cheddar e molho do chef",
    price: 35.00,
    category: "lanches",
    image: "/images/franbacon_1768590959843.png",
    available: true,
  },
  {
    id: "7",
    name: "ADICIONAL: Combo",
    description: "Batata frita + refri lata (Adicione ao seu lanche)",
    price: 10.00,
    category: "lanches",
    available: true,
  },

  // Espetinhos
  {
    id: "8",
    name: "Espetinho de Contra Filé",
    description: "Espetinho delicioso de contra filé assado na brasa",
    price: 12.00,
    category: "espetinhos",
    image: "/images/espetinho_carne_1768587970933.png",
    available: true,
  },
  {
    id: "9",
    name: "Espetinho Franbacon",
    description: "Espetinho de frango com bacon",
    price: 12.00,
    category: "espetinhos",
    image: "/images/espetinho_frango_bacon_1768587986542.png",
    available: true,
  },
  {
    id: "10",
    name: "Espetinho de Queijo Provolone",
    description: "Queijo provolone defumado assado",
    price: 12.00,
    category: "espetinhos",
    image: "/images/espetinho_queijo_1768588001177.png",
    available: true,
  },
  {
    id: "11",
    name: "Espetinho de Kafta",
    description: "Kafta temperada e suculenta",
    price: 12.00,
    category: "refeicoes",
    image: "/images/espetinho_kafta_1768588015648.png",
    available: true,
  },
  {
    id: "12",
    name: "Espetinho de Coração",
    description: "Coração de frango temperado",
    price: 12.00,
    category: "refeicoes",
    image: "/images/espetinho_coracao_1768588029577.png",
    available: true,
  },

  // Refeições (Costela)
  {
    id: "13",
    name: "Costela Simples (600g)",
    description: "600g de costela. Acompanha: Arroz, feijão tropeiro, mandioca, vinagrete e batata chips",
    price: 40.00,
    category: "costela",
    image: "/images/costela_assada_1768588054384.png",
    available: true,
  },
  {
    id: "14",
    name: "Costela Padrão (1kg)",
    description: "1kg de costela. Acompanha: Arroz, feijão tropeiro, mandioca, vinagrete e batata chips",
    price: 75.00,
    category: "costela",
    image: "/images/costela_assada_1768588054384.png",
    available: true,
  },
  {
    id: "15",
    name: "Costela Família (1,2kg)",
    description: "1,200kg de costela. Acompanha: Arroz, feijão tropeiro, mandioca, vinagrete e batata chips",
    price: 120.00,
    category: "costela",
    image: "/images/costela_assada_1768588054384.png",
    available: true,
  },

  // Porções
  {
    id: "16",
    name: "Batata Simples",
    description: "500g de batata com queijo",
    price: 25.00,
    category: "porcoes",
    image: "/images/batata_frita_1768588068395.png",
    available: true,
  },
  {
    id: "17",
    name: "Batata do Pará",
    description: "500g de batata com queijo e 150g de costela desfiada",
    price: 45.00,
    category: "porcoes",
    image: "/images/batata_do_para_1768590307125.png",
    available: true,
  },

  // Bebidas
  {
    id: "18",
    name: "Água",
    description: "500ml",
    price: 3.50,
    category: "bebidas",
    image: "/images/agua_indaia.jpg",
    available: true,
  },
  {
    id: "19",
    name: "Água com gás",
    description: "500ml",
    price: 4.00,
    category: "bebidas",
    image: "/images/agua_com_gas_1768588095847.png",
    available: true,
  },
  {
    id: "20",
    name: "H2O",
    description: "Garrafa 500ml",
    price: 6.00,
    category: "bebidas",
    image: "/images/h2oh.jpg",
    available: true,
  },
  {
    id: "21",
    name: "Suco Lata",
    description: "Sabores variados",
    price: 7.00,
    category: "bebidas",
    image: "/images/suco_del_valle.jpg",
    available: true,
  },
  {
    id: "22",
    name: "Refri Lata",
    description: "350ml",
    price: 6.00,
    category: "bebidas",
    image: "/images/refrigerante_1768588110169.png",
    available: true,
  },
  {
    id: "23",
    name: "Refri 1L",
    description: "Garrafa 1 Litro",
    price: 10.00,
    category: "bebidas",
    image: "/images/refri_pepsi_1l.jpg",
    available: true,
  },
  {
    id: "24",
    name: "Refri 2L",
    description: "Garrafa 2 Litros",
    price: 12.00,
    category: "bebidas",
    image: "/images/refri_coca_2l.jpg",
    available: true,
  },
  {
    id: "25",
    name: "Cerveja Barrigudinha",
    description: "Garrafinha",
    price: 5.00,
    category: "bebidas",
    image: "/images/cerveja_barrigudinha.jpg",
    available: true,
  },
  {
    id: "26",
    name: "Cerveja 600ml",
    description: "Garrafa 600ml",
    price: 14.00,
    category: "bebidas",
    image: "/images/cerveja_1768588137901.png",
    available: true,
  },
  {
    id: "27",
    name: "Heineken",
    description: "Long Neck",
    price: 15.00,
    category: "bebidas",
    image: "/images/cerveja_1768588137901.png",
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

export const resetMenu = async () => {
  // 1. Delete all existing products
  const { error: deleteError } = await supabase
    .from("products")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // Hack to delete all, assuming no ID matches this zero uuid (and neq matches everything else)

  // Alternatively, just delete everything greater than empty string (if id is string) or use a known condition.
  // neq id 0 usually works if ID is UUID.

  if (deleteError) {
    console.error("Error clearing menu:", deleteError);
    // Try another way if UUID check fails or just ignore and try insert? 
    // If table has RLS it might block, but assuming admin has rights.
    // Let's try to proceed.
  }

  // 2. Seed with initial products
  return await seedProducts();
};
