const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL;

const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const productsUrl =
  `${supabaseUrl}/rest/v1/products`;

const headers = {
  apikey: supabaseKey,
  'Content-Type': 'application/json',
};

//GET
export const getProducts = async () => {
  const response = await fetch(
    `${productsUrl}?select=*`,
    {
      method: 'GET',
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(
      'Failed to fetch products'
    );
  }

  const data = await response.json();

  return data;
};

//POST
export const createProduct = async (productData) => {
  const response = await fetch(
    productsUrl,
    {
      method: 'POST',

      headers: {
        ...headers,
        Prefer: 'return=representation',
      },

      body: JSON.stringify(productData),
    }
  );

  if (!response.ok) {
    throw new Error(
      'Failed to create product'
    );
  }

  const data = await response.json();

  return data[0];
};

//PATCH
export const updateProduct = async (id,updates) => {
  if (
    !updates ||
    Object.keys(updates).length === 0) 
    { 
    throw new Error(
      'No product updates provided'
    );
}

  const response = await fetch(
    `${productsUrl}?id=eq.${id}`,
    {
      method: 'PATCH',
      headers: {
        ...headers,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(updates),
    }
  );

  if (!response.ok) {
    throw new Error(
      'Failed to update product'
    );
  }
  
  const data = await response.json();
  return data[0];
};

//DELETE
export const deleteProduct = async (id) => {
  const response = await fetch(
    `${productsUrl}?id=eq.${id}`,
    {
      method: 'DELETE',
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(
      'Failed to delete product'
    );
  }

  return true;
};