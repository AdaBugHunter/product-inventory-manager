import { useState } from "react";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";

function App() {
  const [products, setProducts] = useState([
    { id: 1, name: "Chocolate Cupcake", category: "Cupcake", quantity: 4, isAvailable: true },
    { id: 2, name: "Vanilla Cupcake", category: "Cupcake", quantity: 0, isAvailable: false },
    { id: 3, name: "Red Velvet Cake", category: "Cake", quantity: 5, isAvailable: true },
  ]);

  // ADD
  const addProduct = (newProductData) => {
    const newProduct = {
      id: Date.now(),
      name: newProductData.name,
      category: newProductData.category,
      quantity: newProductData.quantity,
      isAvailable: true,
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  // INCREASE
  const increaseQty = (id) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantity: p.quantity + 1 } : p
      )
    );
  };

  // DECREASE
  const decreaseQty = (id) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, quantity: p.quantity > 0 ? p.quantity - 1 : 0 }
          : p
      )
    );
  };

  // TOGGLE STATUS
  const toggleStatus = (id) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, isAvailable: !p.isAvailable } : p
      )
    );
  };

  // REMOVE
  const removeProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Product Inventory Manager</h1>

      <ProductForm onAddProduct={addProduct} />

      <ProductList
        products={products}
        onIncrease={increaseQty}
        onDecrease={decreaseQty}
        onToggleStatus={toggleStatus}
        onRemove={removeProduct}
      />
    </div>
  );
}

export default App;