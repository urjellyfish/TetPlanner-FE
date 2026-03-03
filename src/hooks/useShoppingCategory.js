import { useContext } from "react";
import { ShoppingCategoryContext } from "../contexts/ShoppingCategoryContext";

export const useShoppingCategory = () => {
  const context = useContext(ShoppingCategoryContext);
  if (!context) {
    throw new Error(
      "useShoppingCategory must be used within a ShoppingCategoryProvider",
    );
  }
  return context;
};
