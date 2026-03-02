import { useContext } from "react";
import { ShoppingItemContext } from "../contexts/shoppingItemContext";

export const useShoppingItem = () => {
  const context = useContext(ShoppingItemContext);
  if (!context) {
    throw new Error("useShoppingItem must be used inside <ShoppingItemProvider>");
  }
  return context;
};