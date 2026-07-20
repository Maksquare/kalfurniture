"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { allProducts as initialProducts } from "@/lib/data";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from LocalStorage or fallback to data.js
  useEffect(() => {
    const stored = localStorage.getItem("phoenix_products");
    if (stored) {
      setProducts(JSON.parse(stored));
    } else {
      setProducts(initialProducts);
      localStorage.setItem("phoenix_products", JSON.stringify(initialProducts));
    }
    setIsLoaded(true);
  }, []);

  const addProduct = (newProduct) => {
    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem("phoenix_products", JSON.stringify(updated));
  };

  const updateProduct = (id, updatedData) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...updatedData } : p));
    setProducts(updated);
    localStorage.setItem("phoenix_products", JSON.stringify(updated));
  };

  const deleteProduct = (id) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem("phoenix_products", JSON.stringify(updated));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, isLoaded }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
