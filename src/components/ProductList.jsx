import { useNavigate } from "react-router"

function ProductList({
  products,
  onRemove,
  onIncrease,
  onDecrease,
  toggleStatus,
}) {
  const navigate = useNavigate();
  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.category}</p>
          <p>{product.quantity}</p>
          <p>{product.is_available ? "Available" : "Out of Stock"}</p>
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
              {!product.is_available
                ? "Mark as Available"
                : "Mark as Not Available"}
            </button>
            <button
              type="button"
              value="onRemove"
              onClick={() => onRemove(product.id)}
            >
              Remove
            </button>
            <button
            type="button"
            onClick={() => navigate(`/product/${product.id}`)}
            >
            View Product
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
