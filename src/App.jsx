import { useEffect, useState } from "react";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import "./App.css";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./services/productApi";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");

  //GET
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setLoadError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  //POST
  const onAddProduct = async (newProductData) => {
    try {
      setActionError("");

      const productData = {
        name: newProductData.name,
        category: newProductData.category,
        quantity: newProductData.quantity,
        is_available: true,
      };

      const createdProduct = await createProduct(productData);

      setProducts((currentProducts) => [...currentProducts, createdProduct]);

      return true;
    } catch (error) {
      setActionError(error.message);

      return false;
    }
  };

  //PATCH on Increase
  const onIncrease = async (id) => {
    try {
      setActionError("");

      const productToUpdate = products.find((product) => product.id === id);
      if (!productToUpdate) {
        return;
      }
      if (!productToUpdate.is_available) {
        return;
      }
      const newQuantity = productToUpdate.quantity + 1;

      const updatedProduct = await updateProduct(productToUpdate.id, {
        quantity: newQuantity,
      });
      setProducts((currentProducts) =>
        currentProducts.map((item) =>
          item.id === updatedProduct.id ? updatedProduct : item,
        ),
      );
    } catch (error) {
      setActionError(error.message);
    }
  };

  //PATCH on Decrease
  const onDecrease = async (id) => {
    const productToDecrease = products.find((product) => product.id === id);
    if (!productToDecrease) {
      return;
    }
    if (productToDecrease.quantity === 0) {
      return;
    }
    if (!productToDecrease.is_available) {
      return;
    }

    try {
      setActionError("");

      const newQuantity = productToDecrease.quantity - 1;

      const updatedProduct = await updateProduct(productToDecrease.id, {
        quantity: newQuantity,
      });

      setProducts((currentProducts) =>
        currentProducts.map((item) =>
          item.id === updatedProduct.id ? updatedProduct : item,
        ),
      );
    } catch (error) {
      setActionError(error.message);
    }
  };

  //PATCH TOGGLE STATUS
  const onToggleStatus = async (id) => {
    const toggleStatus = products.find((product) => product.id === id);
    if (!toggleStatus) {
      return;
    }
    try {
      setActionError("");

      const newStatus = !toggleStatus.is_available;

      const updatedProduct = await updateProduct(toggleStatus.id, {
        is_available: newStatus,
      });

      setProducts((currentProducts) =>
        currentProducts.map((item) =>
          item.id === updatedProduct.id ? updatedProduct : item,
        ),
      );
    } catch (error) {
      setActionError(error.message);
    }
  };

  //DELETE
  const onRemove = async (id) => {
    try {
      setActionError("");

      await deleteProduct(id);

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== id),
      );
    } catch (error) {
      setActionError(error.message);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Product Inventory Manager</h1>

      <ProductForm onAddProduct={onAddProduct} />
      {actionError && <p>Error : {actionError}</p>}
      {loading ? (
        <p>Loading.....</p>
      ) : loadError ? (
        <p>Error: {loadError}</p>
      ) : (
        <ProductList
          products={products}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          onToggleStatus={onToggleStatus}
          onRemove={onRemove}
        />
      )}
    </div>
  );
}

export default App;
