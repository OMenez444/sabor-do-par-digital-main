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

export const products: Product[] = [
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

const PRODUCTS_KEY = "sabor-do-para-products";

export const getProducts = (): Product[] => {
  const stored = localStorage.getItem(PRODUCTS_KEY);
  if (!stored) {
    // seed default products
    saveProducts(products);
    return products;
  }
  try {
    return JSON.parse(stored) as Product[];
  } catch (e) {
    console.error("Failed to parse products", e);
    return products;
  }
};

export const saveProducts = (p: Product[]) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(p));
  return p;
};

export const addProduct = (product: Omit<Product, "id">): Product => {
  const current = getProducts();
  const newProduct: Product = { id: crypto.randomUUID(), ...product };
  const updated = [newProduct, ...current];
  saveProducts(updated);
  return newProduct;
};

export const updateProduct = (id: string, updates: Partial<Product>): Product | undefined => {
  const current = getProducts();
  const updated = current.map((p) => (p.id === id ? { ...p, ...updates } : p));
  saveProducts(updated);
  return updated.find((p) => p.id === id);
};

export const removeProduct = (id: string) => {
  const current = getProducts();
  const updated = current.filter((p) => p.id !== id);
  saveProducts(updated);
};

export const getProductsByCategory = (categoryId: string): Product[] => {
  return getProducts().filter((product) => product.category === categoryId);
};

export const getProductById = (id: string): Product | undefined => {
  return getProducts().find((product) => product.id === id);
};
