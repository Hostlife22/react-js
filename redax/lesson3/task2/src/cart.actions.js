export const ADD_PRODUCT = 'CART/ADD_PRODUCT';
export const REMOVE_PRODUCT = 'CART/REMOVE_PRODUCT';

export const addProduct = (product) => {
  return {
    type: ADD_PRODUCT,
    payload: {
      product,
    },
  };
};

export const removeProduct = (productId) => {
  return {
    type: REMOVE_PRODUCT,
    payload: {
      productId,
    },
  };
};
