import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Products from "../Products/Products";
import { CartContext } from "../CartContext/CartContext";
import "./CartPage.css";

function CartPage() {
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { cart, AddToCart, orderDetails, updateQuantity, removeItem } = useContext(CartContext);
  const isLoggedIn = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchRecommendations = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return navigate("/client/login");

      try {
        const res = await fetch("http://localhost:8080/user/cart/youMayAlsoLike", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setFoods(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [navigate]);


  // Fetch cart when the component mounts
  const fetchCart = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return navigate("/client/login");

    try {
      const res = await fetch("http://localhost:8080/user/cart/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setFoods(data); // Update the foods state with cart data
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart(); // Fetch cart data when component mounts
  }, []);


  // If cart is empty, show a message
  if (cart.length === 0) {
    return (
      <div className="emptyCartContainer">
        <h2>Your cart is empty</h2>
        <p>Looks like you haven’t added anything yet.</p>
        <button className="startShoppingBtn" onClick={() => navigate("/products")}>
          Start Shopping
        </button>

        <h2 className="h2content5">You May Also Like</h2>
        <div className="imageContent2">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            foods.map((item) => (
              <div className="imageItem2" key={item.id}>
                <span className="discountBadge2">{Number(item.discount)}%</span>
                <img src={item.image} alt={item.title} />
                <div className="nameImg2">{item.title}</div>
                <div className="PriceContainer2">
                  <span className="oldPrice2">
                    {(Number(item.discountedPrice) / (1 - Number(item.discount) / 100)).toFixed(2)}DH
                  </span>
                  <span className="newPrice2">{Number(item.discountedPrice).toFixed(2)}DH</span>
                </div>
                <div className="AddToCart2">
                  <button
                    className="Add2"
                    onClick={() => {
                      if (isLoggedIn) {
                        AddToCart(item);
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Calculate totals from cart items
  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const shipping = subtotal * 0.1;
  const total = subtotal + shipping;

  return (
    <div className="cart-page">
      <div id="firstPart" className="tables-container">
        <div className="Product">
          <Products
            products={cart}
            UpdateQuantity={updateQuantity}
            removeItem={removeItem}
          />
        </div>
        <table className="TotalPrice">
          <thead>
            <tr className="headTable2">
              <th>Cart Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="bodyTable2">
            <tr>
              <td>Subtotal</td>
              <td>{subtotal.toFixed(2)} MAD</td>
            </tr>
            <tr>
              <td>Shipping</td>
              <td>{shipping.toFixed(2)} MAD</td>
            </tr>
            <tr>
              <td>Total</td>
              <td>{total.toFixed(2)} MAD</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td className="footTable2" colSpan="2">Place Order</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div id="SecondPart">
        <h2 className="h2content5">You May Also Like</h2>
        <div className="imageContent2">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            foods.map((item) => (
              <div className="imageItem2" key={item.id}>
                <span className="discountBadge2">{Number(item.discount)}%</span>
                <img src={item.image} alt={item.title} />
                <div className="nameImg2">{item.title}</div>
                <div className="PriceContainer2">
                  <span className="oldPrice2">
                    {(Number(item.discountedPrice) / (1 - Number(item.discount) / 100)).toFixed(2)}DH
                  </span>
                  <span className="newPrice2">{Number(item.discountedPrice).toFixed(2)}DH</span>
                </div>
                <div className="AddToCart2">
                  <button
                    className="Add2"
                    onClick={() => {
                      if (isLoggedIn) {
                        AddToCart(item);
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CartPage;