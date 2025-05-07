import React, { createContext, useState, useEffect } from "react";

// Créer le contexte
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [orderDetails, setOrderDetails] = useState({ total: 0 });
  const [showAlert, setShowAlert] = useState(false);
  const [currentItemName, setCurrentItemName] = useState("test");
  const [isAdding, setIsAdding] = useState(false);

  // Effet pour log l'alerte
  useEffect(() => {
    if (showAlert && currentItemName !== "test") {
      console.log("Alerte affichée avec :", currentItemName);
    }
  }, [showAlert, currentItemName]);

  const fetchCartDetails = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const totalRes = await fetch("http://localhost:8080/user/cart/total", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const total = await totalRes.json();
      setOrderDetails({ total });

      const cartRes = await fetch("http://localhost:8080/user/cart/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const cartData = await cartRes.json();
      setCart(cartData);
    } catch (err) {
      console.error("Erreur lors du fetch du panier:", err);
    }
  };

  const AddToCart = async (item) => {
    if (isAdding) return;
    setIsAdding(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("Utilisateur non connecté");
        setShowAlert(true);
        setCurrentItemName("non connecté");
        setTimeout(() => setShowAlert(false), 3000);
        return;
      }

      setCurrentItemName(item.title);
      setShowAlert(true);

      const existingItem = cart.find((i) => i.food?.id === item.id);

      if (existingItem) {
        await updateQuantity(existingItem.itemID, 1);
      } else {
        const res = await fetch(
          `http://localhost:8080/user/cart/addItem?foodID=${item.id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          const msg = await res.text();
          throw new Error(`Ajout échoué: ${msg}`);
        }

        await fetchCartDetails();
      }

      setTimeout(() => {
        setShowAlert(false);
        setCurrentItemName("");
      }, 3000);
    } catch (error) {
      console.error("Erreur dans AddToCart:", error);
      setShowAlert(false);
    } finally {
      setIsAdding(false);
    }
  };

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
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Échec mise à jour quantité");

      await fetchCartDetails();
    } catch (err) {
      console.error("Erreur maj quantité:", err);
    }
  };

  const removeItem = async (itemId) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const res = await fetch(
        `http://localhost:8080/user/cart/${itemId}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const msg = await res.text();
        throw new Error("Échec suppression: " + msg);
      }

      await fetchCartDetails();
    } catch (err) {
      console.error("Erreur suppression item:", err);
    }
  };

  useEffect(() => {
    fetchCartDetails();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        orderDetails,
        AddToCart,
        updateQuantity,
        removeItem,
        showAlert,
        currentItemName,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
