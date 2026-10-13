import {useState} from 'react'


function ProductForm({onAddProduct}) {

  const [formData, setFormData] = useState({
      name : "",
      category : "",
      quantity : ""
    })
  const handleChange = (event) => {
    const {value, name} = event.target;
    setFormData((currentFormData)=>({
      ...currentFormData,
      [name]: value
    }))
  }  
  const handleSubmit = async(event) => {
    event.preventDefault();
    const productData = {
      name : formData.name,
      category : formData.category,
      quantity : Number(formData.quantity),
      is_available : Number(formData.quantity) > 0
    }
    const success = await onAddProduct(productData);
    console.log("success", success)
    if(!success){
      return;
    }
    setFormData({
      name : "",
      category : "",
      quantity : ""
    })
  }
  return (
    <div>
       <form onSubmit={handleSubmit}>
        <label htmlFor="product.name">Product Name: </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <label htmlFor="product.category">Product Category: </label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <label htmlFor="product.quantity">Quantity: </label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          min="0"
          onChange={handleChange}
          required
        />
        <button type="submit">Add Product</button>
      </form>
    </div>
  )
}

export default ProductForm
