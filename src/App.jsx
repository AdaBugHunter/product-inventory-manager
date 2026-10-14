import { useState, useEffect } from "react";
// import ProductForm from "./components/ProductForm";
import { createProduct, deleteProduct, getProducts, updateProduct } from "./components/ProductApi";
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

  //Replace the status
  const replaceProduct = (updatedProduct) => {
     setProducts((currentProduct) =>
        currentProduct.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product,
        ),
      );
  }
  //PATCH
  const onIncrease = async (id) => {
    try {
      setLoading(true);
      const productToUpdate = products.find((product) => product.id === id);
      if (!productToUpdate) {
        return;
      }
      const newQuantity = productToUpdate.quantity + 1;
      const updatedProduct = await updateProduct(id,
        {
          quantity: newQuantity,
          is_available: newQuantity > 0 
        });
     replaceProduct(updatedProduct);
    } catch (error) {
      setActionError(error.message);
    } finally {
      setLoading(false);
    }
  };
  //Decrease quantity
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
      const updatedProduct = await updateProduct(id,update);
      replaceProduct(updatedProduct);
    } catch (error) {
      setActionError(error.message);
    } finally {
      setLoading(false);
    }
  };
  //Toggle status 
  const toggleStatus = async (id) => {
    try {
      setLoading(true);
      const productToUpdate = products.find((product)=>product.id===id)
      if(!productToUpdate)
      {
        return;
      }
      const newStatus = !productToUpdate.is_available;
      const toggleStatusUpdate = await updateProduct(id,
        {
          is_available : newStatus
        }
      )
      replaceProduct(toggleStatusUpdate);
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
     onRemove={onRemove}
     onIncrease={onIncrease}
     onDecrease={onDecrease}
     toggleStatus={toggleStatus}/>
      )}
    </div>
  );
}

export default App;
