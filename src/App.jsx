import { useState, useEffect } from "react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const productsUrl = `${supabaseUrl}/rest/v1/products`;

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${productsUrl}?select=*`, {
          method: "GET",
          headers: {
            apikey: supabaseKey,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  if (loading) {
    return <p>Loading Products.....</p>;
  }

  return (
    <div>
      <h1>Product Inventory</h1>

      { error ? (
        <p>{error}</p>
      ) : (
        products.map((product) => {
          return (
            <div key={product.id}>
              <h3>{product.name}</h3>
              <p>{product.category}</p>
              <p>{product.quantity}</p>
              <p>{product.is_available}</p>
            </div>
          );
        })
      )}
    </div>
  );
}

export default App;