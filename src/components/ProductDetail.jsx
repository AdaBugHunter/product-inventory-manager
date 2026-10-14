import { useEffect,useState } from "react"
import { useParams } from "react-router-dom";
import { viewProduct } from "./ProductApi";

function ProductDetail() {
    const [singleProduct, setSingleProduct] = useState(null);
    const {id}=useParams();
    useEffect(() =>{
      const fetchSingleProduct = async () => {
        const getSingleProduct = await viewProduct(id);
        setSingleProduct(getSingleProduct);
      }
      fetchSingleProduct();
    },[id]);
  return (
    <div>
      <p>View Product detail</p>
      {
        singleProduct && (
            <h3>{singleProduct.name}</h3>
        )
    }
    </div>
  )
}

export default ProductDetail
