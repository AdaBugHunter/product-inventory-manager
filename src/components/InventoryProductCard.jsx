function InventoryProductCard({
  product,
  onIncrease,
  onDecrease,
  onToggleStatus,
  onRemove,
}) {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>Category: {product.category}</p>
      <p>Quantity: {product.quantity}</p>

      <p>
        Status:{" "}
        <strong style={{ color: product.is_available ? "green" : "red" }}>
          {product.is_available ? "Available" : "Out of Stock"}
        </strong>
      </p>

      <div className="card-buttons">
        <button onClick={() => onIncrease(product.id)}>+</button>
        <button onClick={() => onDecrease(product.id)}>−</button>
        <button onClick={() => onToggleStatus(product.id)}>
          {product.is_available ? "Mark Out of Stock" : "Mark Available"}
        </button>
        <button onClick={() => onRemove(product.id)}>Remove</button>
      </div>
    </div>
  );
}

export default InventoryProductCard;