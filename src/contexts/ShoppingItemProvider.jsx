import React, { useState, useMemo } from "react";
import { ShoppingItemContext } from "./shoppingItemContext";
import { shoppingItemAPI } from "../api/shoppingItemAPI";

export const ShoppingItemProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const value = useMemo(
    () => ({
      loading,
      setLoading,
      createItem: async (formData) => {
        return await shoppingItemAPI.createItem(formData);
      },
      undoItem: async (itemId) => {
        return await shoppingItemAPI.deleteItem(itemId);
      },
      updateItem: async (itemId, data) => {
        return await shoppingItemAPI.updateItem(itemId, data);
      },
      deleteItem: async (itemId) => {
        return await shoppingItemAPI.deleteItem(itemId);
      },
      getItemById: async (itemId) => {
        // alias for API method
        return await shoppingItemAPI.getItemDetail(itemId);
      },
    }),
    [loading],
  );

  return (
    <ShoppingItemContext.Provider value={value}>
      {children}
    </ShoppingItemContext.Provider>
  );
};
