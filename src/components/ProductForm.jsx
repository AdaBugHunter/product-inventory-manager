import { useState } from "react";

function ProductForm({ onAddProduct }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !category.trim() || quantity === "") {
      alert("Please fill all fields");
      return;
    }

    const response = await onAddProduct({
      name: name.trim(),
      category: category.trim(),
      quantity: Number(quantity),
    });
    if (!response){
      return;
    }
    

    // reset form
    setName("");
    setCategory("");
    setQuantity("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Product name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <button type="submit">Add Product</button>
    </form>
  );
}

export default ProductForm;