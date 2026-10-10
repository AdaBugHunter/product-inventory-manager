import { useState, useEffect } from "react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const productsUrl = `${supabaseUrl}/rest/v1/products`;

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [name,setName] = useState("");
  const [category,setCategory] = useState("");
  const [quantity,setQuantity] = useState("");
  
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
  //POST
  const addProduct = async (event) => {
   try {
     event.preventDefault();
    setLoading(true);
     const response = await fetch(`${productsUrl}`, {
          method: "POST",
          headers: {
            apikey: supabaseKey,
            "Content-Type": "application/json",
            Prefer : "return=representation"
          },
          body:JSON.stringify({
            name:name.trim(),
            category:category.trim(),
            quantity:quantity,
            is_available: false
          })
        });
        if(!response.ok)
        {
          throw new Error("Failed to add a Product");
        }
        const data = await response.json();
        setProducts((currentProduct)=>[
          ...currentProduct, 
          data[0]
        ])
        setName("");
        setCategory("");
        setQuantity();
   } catch (error) {
    setActionError(error.message);
   } finally{
    setLoading(false);
   }
  }
  
  if (loading) {
    return <p>Loading Products.....</p>;
  }
 
  return (
    <div>
      <h1>Product Inventory</h1>
      <form onSubmit={addProduct}>
        <label htmlFor="product.name">Product Name: </label>
        <input 
           type="text" value={name} onChange={(event)=>setName(event.target.value)} required/>
        <label htmlFor="product.category">Product Category: </label>
        <input type="text" value={category} onChange={(event)=>setCategory(event.target.value)} required/>
        <label htmlFor="product.quantity">Quantity: </label>
        <input type="number" value={quantity} min="0" onChange={(event)=>setQuantity(event.target.value)} required/>
        <button type="submit">Add Product</button>
      </form>
      {
        actionError && (
           <p style={{color:"red"}}>{actionError}</p>
        ) 
      }
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