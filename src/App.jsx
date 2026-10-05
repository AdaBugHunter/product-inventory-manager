import { useEffect, useState } from "react";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import "./App.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
console.log(supabaseUrl);
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const productsUrl = `${supabaseUrl}/rest/v1/products`;

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //GET
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(productsUrl, {
          method: "GET",
          headers: {
            apikey: supabaseKey,
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        console.log(data);
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;

//POST
  const onAddProduct = async (newProductData) => {
    try {
      const response = await fetch(productsUrl, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          name: newProductData.name,
          category: newProductData.category,
          quantity: Number(newProductData.quantity),
          is_available: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      const createdProduct = await response.json();
      const newProduct = Array.isArray(createdProduct)
        ? createdProduct[0]
        : createdProduct;

      setProducts((currentProducts) => [...currentProducts, newProduct]);
    } catch (err) {
      setError(err.message);
    }
  };

  //PATCH on Increase
  const onIncrease = async (id) => {
    try {
      const productToUpdate = products.find((product) => product.id === id);
      if (!productToUpdate) return;

      const response = await fetch(`${productsUrl}?id=eq.${id}`, {
        method: "PATCH",
        headers: {
          apikey: supabaseKey,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          quantity: productToUpdate.quantity + 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to increase product");
      }

      const updatedProduct = await response.json();
      const normalizedProduct = Array.isArray(updatedProduct)
        ? updatedProduct[0]
        : updatedProduct;

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === normalizedProduct.id ? normalizedProduct : product
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  //PATCH on Decrease
  const onDecrease = async (id) => {
    try {
      const productToUpdate = products.find((product) => product.id === id);
      if (!productToUpdate) return;

      const newQuantity = Math.max(0, productToUpdate.quantity - 1);

      const response = await fetch(`${productsUrl}?id=eq.${id}`, {
        method: "PATCH",
        headers: {
          apikey: supabaseKey,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          quantity: newQuantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to decrease product");
      }

      const updatedProduct = await response.json();
      const normalizedProduct = Array.isArray(updatedProduct)
        ? updatedProduct[0]
        : updatedProduct;

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === normalizedProduct.id ? normalizedProduct : product
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };


  //PATCH TOGGLE STATUS
  const onToggleStatus = async (id) => {
    try {
      const productToUpdate = products.find((product) => product.id === id);
      console.log(productToUpdate);
      if (!productToUpdate) return;

      const newStatus = !productToUpdate.is_available;
      console.log(newStatus);
      const response = await fetch(`${productsUrl}?id=eq.${id}`, {
        method: "PATCH",
        headers: {
          apikey: supabaseKey,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          is_available: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update the status");
      }

      const updatedProduct = await response.json();
      const normalizedProduct = Array.isArray(updatedProduct)
        ? updatedProduct[0]
        : updatedProduct;

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === normalizedProduct.id ? normalizedProduct : product
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  //DELETE
const onRemove = async (id) => {
  try{
     const productToDelete = products.find((product) => product.id === id);
      if (!productToDelete) return;

      const response = await fetch(`${productsUrl}?id=eq.${id}`, {
        method: "DELETE",
        headers: {
          apikey: supabaseKey,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
      });
        if (!response.ok) {
        throw new Error("Failed to update the status");
      }
      setProducts((currentProducts) =>
      currentProducts.filter(
        (product) => product.id !== id
      ));
    }catch (err) {
      setError(err.message);
    }
}

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Product Inventory Manager</h1>
     
      <ProductForm onAddProduct={onAddProduct} />
       <ProductList
        products={products}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
        onToggleStatus={onToggleStatus}
        onRemove={onRemove}
      />
      
    </div>
  );
}

export default App;