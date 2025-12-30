import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { categories, getProducts } from "@/data/products";
import MenuHeader from "@/components/menu/MenuHeader";
import CategoryTabs from "@/components/menu/CategoryTabs";
import ProductList from "@/components/menu/ProductList";
import CartFooter from "@/components/menu/CartFooter";
import CartDrawer from "@/components/menu/CartDrawer";

const MenuPage: React.FC = () => {
  const { restaurante } = useParams();
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get("mesa");

  const [products, setProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || "");
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      // Import dynamically to avoid circular issues or just use the imported one if I import it
      // import { getProducts } from "@/data/products";
      const data = await getProducts();
      setProducts(data);
    };
    loadProducts();
  }, []);

  const currentCategory = categories.find((cat) => cat.id === activeCategory);
  // Filter locally
  const categoryProducts = products.filter(p => p.category === activeCategory);

  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <MenuHeader tableNumber={tableNumber} />
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        <main>
          <ProductList
            products={categoryProducts}
            categoryName={currentCategory?.name || "Produtos"}
          />
        </main>
        <CartFooter onViewCart={() => setIsCartOpen(true)} />
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          tableNumber={tableNumber}
        />
      </div>
    </CartProvider>
  );
};

export default MenuPage;
