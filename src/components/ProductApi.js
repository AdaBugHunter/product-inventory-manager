const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const productsUrl = `${supabaseUrl}/rest/v1/products`;

const headers = {
    apikey: supabaseKey,
    "Content-Type": "application/json",
}
//GET METHOD
export const getProducts = async() => {
    const response = await fetch(`${productsUrl}?select=*`, {
          method: "GET",
          headers: headers
        });
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        return data;
} 

//POST METHOD
export const createProduct = async (productData) => {
     const response = await fetch(`${productsUrl}`, {
        method: "POST",
        headers: {
         ...headers,
          Prefer: "return=representation",
        },
        body: JSON.stringify(productData),
      });
      if (!response.ok) {
        throw new Error("Failed to add a Product");
      }
      const data = await response.json();
      return data[0];
}

//DELETE METHOD
export const deleteProduct = async (id) => {
    const response = await fetch(`${productsUrl}?id=eq.${id}`,
    {
        method : "DELETE",
        headers:
        {
       ...headers,
        Prefer : "return=representation"
        }
    }
    )
    if(!response.ok){
        throw new Error("Failed to delete a product")
    }
    return true;
}