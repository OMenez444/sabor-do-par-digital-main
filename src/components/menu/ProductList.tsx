import React from "react";
import { Product } from "@/data/products";
import ProductCard from "./ProductCard";

interface ProductListProps {
  products: Product[];
  categoryName: string;
}

const ProductList: React.FC<ProductListProps> = ({ products, categoryName }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Nenhum produto disponível nesta categoria.
        </p>
      </div>
    );
  }

  return (
    <div className="container py-4 pb-28">
      <h2 className="text-xl font-bold text-foreground mb-4">{categoryName}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
