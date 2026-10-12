import { useState, useEffect } from "react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const productsUrl = `${supabaseUrl}/rest/v1/products`;

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");

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
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          name: name.trim(),
          category: category.trim(),
          quantity: quantity,
          is_available: false,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add a Product");
      }
      const data = await response.json();
      setProducts((currentProduct) => [...currentProduct, data[0]]);
      setName("");
      setCategory("");
      setQuantity();
    } catch (error) {
      setActionError(error.message);
    } finally {
      setLoading(false);
    }
  };

  //PATCH
  const onIncrease = async (id) => {
    try {
      setLoading(true);
      const productToUpdate = products.find((product) => product.id === id);
      if (!productToUpdate) {
        return;
      }
      const newQuantity = productToUpdate.quantity + 1;
      const response = await fetch(`${productsUrl}?id=eq.${id}`, {
        method: "PATCH",
        headers: {
          apikey: supabaseKey,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          quantity: newQuantity,
          is_available: newQuantity>0 
        }),
      });
      if (!response) {
        throw new Error("Failed to update the quantity");
      }
      const data = await response.json();
      setProducts((currentProduct) =>
        currentProduct.map((product) =>
          product.id === data[0].id ? data[0] : product,
        ),
      );
    } catch (error) {
      setActionError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const onDecrease = async (id) => {
    try {
      setLoading(true);
      const productToDecrease = products.find((product) => product.id === id);
      if (!productToDecrease) {
        return;
      }
      if (productToDecrease.quantity <= 0) {
        return;
      }
      const newQuantity = productToDecrease.quantity - 1;
      const update = {
        quantity : newQuantity
      }
      if(newQuantity===0){
        update.is_available=false
      }
      console.log("update",update);
      const response = await fetch(`${productsUrl}?id=eq.${id}`, {
        method: "PATCH",
        headers: {
          apikey: supabaseKey,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(
          update
       ),
      });
      if (!response) {
        throw new Error("Failed to decrease product");
      }
      const data = await response.json();
      setProducts((currentProduct) =>
        currentProduct.map((product) =>
          product.id === data[0].id ? data[0] : product,
        ),
      );
    } catch (error) {
      setActionError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const toggleStatus = async (id) => {
    try {
      setLoading(true);
      const productToUpdate = products.find((product)=>product.id===id)
      if(!productToUpdate)
      {
        return;
      }
      const newStatus = !productToUpdate.is_available;
      const response = await fetch(`${productsUrl}?id=eq.${id}`,
        {
          method : "PATCH",
          headers:{
            apikey : supabaseKey,
            "Content-Type":"application/json",
            Prefer : "return=representation"
          },
          body: JSON.stringify({
            is_available: newStatus
          })
        } 
      )
      if(!response.ok){
        throw new Error("Failed to update product Status")
      }
      const data = await response.json();
      setProducts((currentProduct)=>currentProduct.map((product)=>
      product.id===data[0].id ? data[0] : product 
      ))
    } catch (error) {
      setActionError(error.message)
    } finally {
      setLoading(false);
    }
  } 

  //DELETE
  const onRemove = async (id) => {
    try {
      setLoading(true);
      const confirm = window.confirm("Are you sure to delete the product");
      if(!confirm){
        return;
      }
      const response = await fetch(`${productsUrl}?id=eq.${id}`,
        {
          method : "DELETE",
          headers:
          {
            apikey : supabaseKey,
            "Content-Type":"application/json",
            Prefer : "return=representation"
          }
        }
      )
       if(!response.ok){
          throw new Error("Failed to delete a product")
        }
        setProducts((currentProduct)=>currentProduct.filter((product)=>
        product.id != id 
     ))
    } catch (error) {
      setActionError(error.message)
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
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <label htmlFor="product.category">Product Category: </label>
        <input
          type="text"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          required
        />
        <label htmlFor="product.quantity">Quantity: </label>
        <input
          type="number"
          value={quantity}
          min="0"
          onChange={(event) => setQuantity(event.target.value)}
          required
        />
        <button type="submit">Add Product</button>
      </form>
      {actionError && <p style={{ color: "red" }}>{actionError}</p>}
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          {products.map((product) => (
            <div key={product.id}>
              <h3>{product.name}</h3>
              <p>{product.category}</p>
              <p>{product.quantity}</p>
              <p>{product.is_available ? "Available" : "Out of Stock"}
               </p>
              <div>
                <button
                  type="button"
                  value="increase"
                  onClick={() => onIncrease(product.id)}
                >
                  +
                </button>
                <button
                  type="button"
                  value="decrease"
                  onClick={() => onDecrease(product.id)}
                >
                  -
                </button>
                <button 
                type="button"
                value="ToggleStatus"
                onClick={() => toggleStatus(product.id)}
                >
                  {!product.is_available ? "Mark as Available" : "Mark as Not Available"}
                </button>
                <button
                type="button"
                value="onRemove"
                onClick={()=>onRemove(product.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default App;
