import { useState, useEffect } from "react";
// import ProductForm from "./components/ProductForm";
import { createProduct, deleteProduct, getProducts } from "./components/ProductApi";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";


function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
 

  useEffect(() => {
    //GET PRODUCTS
    const fetchProducts = async () => {
      try {
      const getData = await getProducts();
        setProducts(getData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  //ADD PRODCUT
   const addProduct = async (productData) => {
    try {
      // setActionLoading(true);
      // setActionError("");
      const response = await createProduct(productData)
     
      setProducts((currentProduct) => [...currentProduct, response]);
      return true;
    } catch (error) {
      setActionError(error.message);
      return false;
    } finally{
      // setActionLoading(false)
    }
  };
  //PATCH
  // const onIncrease = async (id) => {
  //   try {
  //     setLoading(true);
  //     const productToUpdate = products.find((product) => product.id === id);
  //     if (!productToUpdate) {
  //       return;
  //     }
  //     const newQuantity = productToUpdate.quantity + 1;
  //     const response = await fetch(`${productsUrl}?id=eq.${id}`, {
  //       method: "PATCH",
  //       headers: {
  //         apikey: supabaseKey,
  //         "Content-Type": "application/json",
  //         Prefer: "return=representation",
  //       },
  //       body: JSON.stringify({
  //         quantity: newQuantity,
  //         is_available: newQuantity>0 
  //       }),
  //     });
  //     if (!response.ok) {
  //       throw new Error("Failed to update the quantity");
  //     }
  //     const data = await response.json();
  //     setProducts((currentProduct) =>
  //       currentProduct.map((product) =>
  //         product.id === data[0].id ? data[0] : product,
  //       ),
  //     );
  //   } catch (error) {
  //     setActionError(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // const onDecrease = async (id) => {
  //   try {
  //     setLoading(true);
  //     const productToDecrease = products.find((product) => product.id === id);
  //     if (!productToDecrease) {
  //       return;
  //     }
  //     if (productToDecrease.quantity <= 0) {
  //       return;
  //     }
  //     const newQuantity = productToDecrease.quantity - 1;
  //     const update = {
  //       quantity : newQuantity
  //     }
  //     if(newQuantity===0){
  //       update.is_available=false
  //     }
  //     console.log("update",update);
  //     const response = await fetch(`${productsUrl}?id=eq.${id}`, {
  //       method: "PATCH",
  //       headers: {
  //         apikey: supabaseKey,
  //         "Content-Type": "application/json",
  //         Prefer: "return=representation",
  //       },
  //       body: JSON.stringify(
  //         update
  //      ),
  //     });
  //     if (!response.ok) {
  //       throw new Error("Failed to decrease product");
  //     }
  //     const data = await response.json();
  //     setProducts((currentProduct) =>
  //       currentProduct.map((product) =>
  //         product.id === data[0].id ? data[0] : product,
  //       ),
  //     );
  //   } catch (error) {
  //     setActionError(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // const toggleStatus = async (id) => {
  //   try {
  //     setLoading(true);
  //     const productToUpdate = products.find((product)=>product.id===id)
  //     if(!productToUpdate)
  //     {
  //       return;
  //     }
  //     const newStatus = !productToUpdate.is_available;
  //     const response = await fetch(`${productsUrl}?id=eq.${id}`,
  //       {
  //         method : "PATCH",
  //         headers:{
  //           apikey : supabaseKey,
  //           "Content-Type":"application/json",
  //           Prefer : "return=representation"
  //         },
  //         body: JSON.stringify({
  //           is_available: newStatus
  //         })
  //       } 
  //     )
  //     if(!response.ok){
  //       throw new Error("Failed to update product Status")
  //     }
  //     const data = await response.json();
  //     setProducts((currentProduct)=>currentProduct.map((product)=>
  //     product.id===data[0].id ? data[0] : product 
  //     ))
  //   } catch (error) {
  //     setActionError(error.message)
  //   } finally {
  //     setLoading(false);
  //   }
  // } 

  //DELETE
  const onRemove = async (id) => {
    try {
      setLoading(true);
      const confirm = window.confirm("Are you sure to delete the product");
      if(!confirm){
        return;
      }
      await deleteProduct(id);
        setProducts((currentProduct)=>currentProduct.filter((product)=>
        product.id !== id 
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
     <ProductForm onAddProduct={addProduct}/>
      {actionError && <p style={{ color: "red" }}>{actionError}</p>}
      {error ? (
        <p>{error}</p>
      ) : (
     <ProductList products={products}
     onRemove={onRemove}/>
      )}
    </div>
  );
}

export default App;
