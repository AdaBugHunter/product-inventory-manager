import InventoryProductCard from "./InventoryProductCard";

function ProductList({
  products,
  onIncrease,
  onDecrease,
  onToggleStatus,
  onRemove,
}) {
  if (!products || products.length === 0) {
    return <p>No products in inventory.</p>;
  }

  return (
    <div>
      <h2>Product List</h2>
      {products.map((product) => (
        <InventoryProductCard
          key={product.id}
          product={product}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          onToggleStatus={onToggleStatus}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

export default ProductList;