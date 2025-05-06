import React, { createContext, useState, useEffect } from "react";

// Créer le contexte
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const userId = localStorage.getItem("userId");
  const [cart, setCart] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [orderDetails, setOrderDetails] = useState({ total: 0 });
  const [currentItemName, setCurrentItemName] = useState("test"); // Nom de l'item
  const [isAdding, setIsAdding] = useState(false); // Nouveau state pour contrôler les ajouts

  // UseEffect pour afficher l'alerte une seule fois
  useEffect(() => {
    if (showAlert && currentItemName !== "test") {
      console.log("Alerte affichée avec l'élément :", currentItemName);
      // L'alerte peut être affichée ici, ou gérer d'autres actions
    }
  }, [currentItemName, showAlert]); // Dépend de currentItemName et showAlert

  const fetchCartDetails = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      // Fetch total du panier
      const totalResponse = await fetch("http://localhost:8080/user/cart/total", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const total = await totalResponse.json();
      setOrderDetails({ total });

      // Fetch items du panier
      const cartResponse = await fetch("http://localhost:8080/user/cart/", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const cartData = await cartResponse.json();
      setCart(cartData);
    } catch (error) {
      console.error("Failed to fetch cart details:", error);
    }
  };

  // Fonction d'ajout au panier
  const AddToCart = async (item) => {
    if (isAdding) return;
    setIsAdding(true);
  
    try {
      console.log("Adding item:", item.title);
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No token found");
        return;
      }
  
      // Mettre à jour le nom de l'item et afficher l'alerte
      setCurrentItemName(item.title);
      setShowAlert(true);
  
      // Trouver l'élément existant dans le panier
      const existingItem = cart.find((i) => i.food?.id === item.id);
      console.log("Existing item in cart:", existingItem);
  
      try {
        if (existingItem) {
          // Si l'élément existe déjà, mettre à jour la quantité
          await updateQuantity(existingItem.itemID, 1);
        } else {
          // Sinon, ajouter le nouvel élément
          const res = await fetch(`http://localhost:8080/user/cart/addItem?foodID=${item.id}`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
  
          if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(`Failed to add item to cart: ${errorMsg}`);
          }
  
          // Actualiser les détails du panier
          await fetchCartDetails();
        }
      } catch (error) {
        console.error("Failed to add item to cart:", error);
        setShowAlert(false);
        throw error; // Propager l'erreur pour le catch externe
      }
  
      // Cacher l'alerte après 3 secondes
      setTimeout(() => {
        setShowAlert(false);
        setCurrentItemName("");
      }, 3000);
  
    } catch (error) {
      console.error("Error in AddToCart:", error);
    } finally {
      setIsAdding(false);
    }
  };
  // Update cart item quantity
  const updateQuantity = async (itemId, change) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const endpoint =
        change > 0
          ? `http://localhost:8080/user/cart/${itemId}/increment`
          : `http://localhost:8080/user/cart/${itemId}/decrement`;

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to update item quantity");

      // Re-fetch cart details après la mise à jour
      fetchCartDetails();
    } catch (error) {
      console.error("Failed to update item quantity:", error);
    }
  };

  // Fetch cart details au montage du composant
  useEffect(() => {
    fetchCartDetails();
  }, []);

  return (
    <CartContext.Provider value={{
      cart,
      orderDetails,
      AddToCart,
      updateQuantity,
      showAlert,           // Ajout de cette valeur
      currentItemName      // Et de celle-ci
    }}>
      {children}
    </CartContext.Provider>
  );
};
