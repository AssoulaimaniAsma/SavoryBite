import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Products from "../Products/Products";
import { CartContext } from "../CartContext/CartContext";
//import "./CartPage.css";

function CartPage() {
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendation, setRecommandation] = useState([]);

  const { cart, AddToCart, orderDetails,updateQuantity , removeItem, clearCart } = useContext(CartContext);
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
        setRecommandation(data);
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
    if (!token) return navigate("/client/signin");

    try {
      const res = await fetch("http://localhost:8080/user/cart/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const text = await res.text();
      const data = text.trim() ? JSON.parse(text) : [];

      setFoods(data); // Update the foods state with cart data
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch cart details:",err);
      setError("Failed to fetch data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart(); // Fetch cart data when component mounts
  }, []);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
  
      const token = localStorage.getItem("authToken");
      if (!token) return navigate("/client/signin");
  
      try {
        const res1 = await fetch("http://localhost:8080/user/orders/placeOrders", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (res1.ok) {
          const text = await res1.text();
          console.log("order is placed");
          navigate("/client/OrderHistory");
          
        }
      } catch (err) {
        console.error("Error in handlePlaceOrder:", err);
      }
  };

  // If cart is empty, show a message
  if (cart.length === 0) {
    return (
      <div className="text-center py-[50px] px-[20px] bg-[#f9f9f9]">
        <h2 className="text-[2rem] mb-[10px] text-[#333]">Your cart is empty</h2>
        <p className="text-[1.1rem] text-[#666] mb-[30px]">Looks like you haven't added anything yet.</p>
        <button 
          className="px-[25px] py-[12px] bg-[#FD4C2A] text-white rounded-[8px] text-[1rem] hover:bg-black transition-colors duration-300 border-none cursor-pointer"
          onClick={() => navigate("/client/Our_Menu")}
        >
          Start Shopping
        </button>
  
        <div className="mt-8 p-8 bg-[#fdf4f4] border-t-2 border-[#f3c1b8]">
      <h2 className="text-3xl font-bold text-center text-[#FD4C2A] mb-8">You May Also Like</h2>
      
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className="flex flex-wrap justify-center gap-8">
          {recommendation.map((item) => (
            <div 
              key={item.id}
              className="w-[270px] bg-white rounded-2xl shadow-md overflow-hidden text-center transition-transform duration-300 hover:-translate-y-1 relative"
            >
              <span className="absolute top-2 right-2 bg-[#FD4C2A] text-white px-2 py-1 rounded text-sm z-10">
                {Number(item.discount)}%
              </span>
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-[280px] object-cover border-b border-[#eee]"
              />
              <div className="text-lg mt-2 text-gray-800">{item.title}</div>
              <div className="my-2">
                <span className="text-sm text-gray-500 line-through mr-2">
                  {(Number(item.discountedPrice) / (1 - Number(item.discount) / 100)).toFixed(2)}DH
                </span>
                <span className="font-bold text-[#FD4C2A]">
                  {Number(item.discountedPrice).toFixed(2)}DH
                </span>
              </div>
              <div className="mt-2 mb-4">
                <button
                  className="w-8 h-8 bg-white border-2 border-[#FD4C2A] text-[#FD4C2A] rounded-full text-xl transition-colors duration-200 hover:bg-[#FD4C2A] hover:text-white"
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
          ))}
        </div>
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
    <div className="flex flex-col">
    {/* First Part - Tables Container */}
    <div className="flex justify-center w-full gap-5 pt-5">
  {/* Products Table */}
  <div className="w-[45%] rounded-2xl overflow-hidden">
    <Products
      products={cart}
      updateQuantity={updateQuantity}
      removeItem={removeItem}
    />
  </div>

  {/* Total Price Table - Version avec hauteur fixe */}
  <div className="w-[25%] flex flex-col">
  <div className="bg-white rounded-2xl overflow-hidden shadow-md flex flex-col" style={{ minHeight: '400px' }}>
  {/* Header - 1/3 de l'espace */}
  <div className="bg-[#FD4C2A] p-3 text-xl text-center text-white font-bold flex items-center justify-center h-[18%]">
    Cart Total
  </div>
  
  {/* Content - 1/3 de l'espace */}
  <div className="flex-1 flex flex-col justify-center p-4 h-[40%]">
    <div className="space-y-6">
      <div className="flex justify-between items-center h-[30%]">
        <span className="text-gray-700">Subtotal:</span>
        <span className="font-medium">
          {cart.reduce((sum, item) => sum + item.food.discountedPrice * item.quantity, 0).toFixed(2)} MAD
        </span>
      </div>
      
      <div className="flex justify-between items-center h-[30%]">
        <span className="text-gray-700">Shipping:</span>
        <span className="font-medium">
          {cart.reduce((sum, item) => {
            if (item.food?.restaurant) {
              const restaurantId = item.food.restaurant.id;
              if (!sum.restaurants[restaurantId]) {
                sum.restaurants[restaurantId] = item.food.restaurant.shippingFees;
                sum.total += item.food.restaurant.shippingFees;
              }
            }
            return sum;
          }, { restaurants: {}, total: 0 }).total.toFixed(2)} MAD
        </span>
      </div>
      
      <div className="flex justify-between items-center h-[40%] font-bold text-lg pt-2">
        <span className="text-gray-800">Total:</span>
        <span className="text-[#FD4C2A]">
          {(
            cart.reduce((sum, item) => sum + item.totalPrice, 0) + 
            cart.reduce((sum, item) => {
              if (item.food?.restaurant) {
                const restaurantId = item.food.restaurant.id;
                if (!sum.restaurants[restaurantId]) {
                  sum.restaurants[restaurantId] = item.food.restaurant.shippingFees;
                  sum.total += item.food.restaurant.shippingFees;
                }
              }
              return sum;
            }, { restaurants: {}, total: 0 }).total
          ).toFixed(2)} MAD
        </span>
      </div>
    </div>
  </div>

  {/* Button - 1/3 de l'espace */}
  <div className="mt-3 p-6 flex items-center justify-center h-[30%]">
    <button 
      onClick={handlePlaceOrder}
      className="w-full py-4 bg-[#FD4C2A] text-white font-bold rounded-lg hover:bg-[#e04123] transition-colors shadow-md"
    >
      Place Order
    </button>
  </div>
</div>
  </div>
</div>
  
    {/* Second Part - Recommendations */}
    <div className="mt-8 p-8 bg-[#fdf4f4] border-t-2 border-[#f3c1b8]">
      <h2 className="text-3xl font-bold text-center text-[#FD4C2A] mb-8">You May Also Like</h2>
      
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className="flex flex-wrap justify-center gap-8">
          {recommendation.map((item) => (
            <div 
              key={item.id}
              className="w-[270px] bg-white rounded-2xl shadow-md overflow-hidden text-center transition-transform duration-300 hover:-translate-y-1 relative"
            >
              <span className="absolute top-2 right-2 bg-[#FD4C2A] text-white px-2 py-1 rounded text-sm z-10">
                {Number(item.discount)}%
              </span>
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-[280px] object-cover border-b border-[#eee]"
              />
              <div className="text-lg mt-2 text-gray-800">{item.title}</div>
              <div className="my-2">
                <span className="text-sm text-gray-500 line-through mr-2">
                  {(Number(item.discountedPrice) / (1 - Number(item.discount) / 100)).toFixed(2)}DH
                </span>
                <span className="font-bold text-[#FD4C2A]">
                  {Number(item.discountedPrice).toFixed(2)}DH
                </span>
              </div>
              <div className="mt-2 mb-4">
                <button
                  className="w-8 h-8 bg-white border-2 border-[#FD4C2A] text-[#FD4C2A] rounded-full text-xl transition-colors duration-200 hover:bg-[#FD4C2A] hover:text-white"
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
          ))}
        </div>
      )}
    </div>
  </div>
  );
}

export default CartPage;