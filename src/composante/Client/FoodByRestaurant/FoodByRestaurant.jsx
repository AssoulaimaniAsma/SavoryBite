// FoodByRestaurant.js
import { FiSearch } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import React, { useState, useEffect, useContext } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import axios from "axios";
import { CartContext } from "../CartContext/CartContext";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { ShoppingCart } from "lucide-react";

import { useRef } from "react";
const moreFilters = ["American", "Asian", "Bakery & Pastry", "Shawarma"];

export default function FoodByRestaurant() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openMoreFilters, setOpenMoreFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { cart, AddToCart, showAlert, UpdateQuantity, currentItemName } = useContext(CartContext);
  const [searchParams] = useSearchParams();
  const [popularFilters, setPopularFilters] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  

  // Charger les catégories populaires
  useEffect(() => {
    fetch("http://localhost:8080/public/allCategories")
      .then((res) => res.json())
      .then((data) => {
        const filteredAndSorted = data
          .map((cat) => ({
            id: cat.id,
            name: cat.title,
            icon: cat.categoryIcon,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setPopularFilters(filteredAndSorted);
      })
      .catch((err) => console.error("Erreur de récupération :", err));
  }, []);

  // Charger les plats du restaurant
  useEffect(() => {
    if (!id) return;
    axios
      .get(`http://localhost:8080/public/restaurants/${id}/allFood`)
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Erreur lors du fetch des plats :", error));
  }, [id]);
  useEffect(() => {
    const fetchRestaurantInfo = async () => {
      if (!id) return;
  
      try {
        const response = await fetch(`http://localhost:8080/public/restaurants/${id}`);
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
  
        const data = await response.json();
  
        // Stockage de toutes les infos nécessaires
        const address = data?.addressShortDTO || {};
        const fullAddress = [address.region, address.province, address.commune]
          .filter(Boolean)
          .join(", ");
  
        setRestaurantInfo({
          title: data.title,
          phone: data.phone,
          contactEmail: data.contactEmail,
          profileImg: data.profileImg,
          profileBanner: data.profileBanner,
          address: fullAddress,
          status: data.status,
          shippingFees: data.shippingFees,
        });
  
      } catch (error) {
        console.error("Erreur lors de la récupération des infos du restaurant:", error);
        setRestaurantInfo(null); // ou tu peux gérer un fallback ici
      }
    };
  
    fetchRestaurantInfo();
  //}, [restaurantInfo?.id]);
}, [id]);

  const scrollContainerRef = useRef(null);

  const scroll = (scrollOffset) => {
    console.log("Dghet ")
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += scrollOffset;
    }
  };
  
  
  // Mettre à jour la catégorie sélectionnée via l'URL (attendre que popularFilters soit dispo)
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (!categoryParam || popularFilters.length === 0) return;

    const isValid = popularFilters.some((f) => f.name === categoryParam) || moreFilters.includes(categoryParam);
    if (isValid) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory("All");
    }
    setCurrentPage(1);
  }, [searchParams, popularFilters]);

  // Appliquer les filtres
  const filteredProducts = products.filter((product) => {
    if (selectedCategory === "All") return true;

    const selectedCatNormalized = selectedCategory.trim().toLowerCase();
    const productCategories = Array.isArray(product.categoryTitles)
      ? product.categoryTitles
      : [product.categoryTitles];

    return productCategories.some(
      (cat) => cat?.toString().trim().toLowerCase() === selectedCatNormalized
    );
  });
  const [showModal2, setShowModal2] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const searchedProducts = filteredProducts.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const askAddToCart = (item) => {
    const token = localStorage.getItem("authToken"); // Assure-toi que le token est bien stocké sous cette clé
  
    if (!token) {
      setShowModal2(true);      return;
    }
    setSelectedItem(item);
    setShowModal(true);
  };
  const closeModal = () => {
    navigate("/client/signin"); // Redirect to login page
    setShowModal2(false); // Close the modal
  };
  const totalItems = searchedProducts.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
  const currentItems = searchedProducts.slice(startIndex, endIndex);

  const confirmAddToCart = async () => {
    const token = localStorage.getItem("authToken");
    if (!token || !selectedItem) return;
  
    try {
      AddToCart(selectedItem); // Optionnel : met à jour ton contexte/panier local
      setShowModal(false);
    } catch (err) {
      alert("Erreur lors de l'ajout au panier !");
      console.error(err);
    }
  };
  return (
    <div className="mx-auto p-5">
            {showAlert && (
        <div className="fixed-alert">
          <div
            className="flex items-center p-4 text-sm text-black rounded-lg bg-[#f0b9ae] dark:bg-gray-800 dark:text-blue-400"
            role="alert"
          >
            <svg
              className="shrink-0 inline w-4 h-4 me-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div>
            <div className="flex items-center">
  <ShoppingCart className="mr-2" size={16} />
  <span className="font-medium">{currentItemName} added to cart successfully!</span>
</div>
            </div>
          </div>
        </div>
      )}
      {/* Banner + Profil + Description */}
      {restaurantInfo && (
  <div className="relative w-full h-60 mb-40">
    {/* Image de couverture */}
    <img
      src={restaurantInfo.profileBanner || "/image/signinRes.jpg"}
      alt="cover"
      className="absolute top-0 left-0 w-full h-60 object-cover z-0 rounded-lg"
    />

    {/* Centrage du profil */}
    <div className="w-full max-w-7xl mx-auto px-6 md:px-8 relative">
      {/* Profil positionné de façon stable et centrée */}
      <div className="absolute mt-40 -bottom-15 left-1/2 transform -translate-x-1/2 sm:left-8 sm:translate-x-0 flex items-center space-x-4 z-10">
        {restaurantInfo.profileImg ? (
          <img
            src={restaurantInfo.profileImg}
            alt="Profile"
            className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold border-4 border-white shadow-lg">
            {restaurantInfo.title?.charAt(0) || "?"}
          </div>
        )}

        <div className="text-center mt-20 sm:text-left">
          <h3 className="text-2xl font-semibold text-[#FD4C2A]">{restaurantInfo.title}</h3>
          <p className="text-gray-500">{restaurantInfo.contactEmail}</p>
          <p className="text-gray-500">{restaurantInfo.address}</p>
          <p className="text-gray-500">{restaurantInfo.phone}</p>
        </div>
      </div>
    </div>
  </div>
)}


  
      {/* Catégories en boules */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-orange-600">Our Categories</h2>
      </div>
      <div className="relative flex items-center justify-center mb-10">
  {/* Bouton gauche */}
  <button
    onClick={() => scroll(-200)}
    className="relative left-0 z-10 bg-white rounded-full shadow p-2 hover:bg-orange-100"
  >
    <ChevronLeft className="text-orange-500" />
  </button>

  {/* Conteneur scrollable */}
  <div
    
    className="overflow-hidden w-[430px] px-4" // largeur pour 5 catégories (5 x 72px)
  >
    <div
    ref={scrollContainerRef}
      className="flex gap-4 overflow-x-auto scrollbar-hide"
      style={{ scrollSnapType: "x mandatory", scrollBehavior: "smooth" }}
    >
      {popularFilters.map((filter, index) => (
        <button
        key={index}
        className={`w-24 h-12 px-4 py-2 rounded-full flex items-center justify-center text-sm font-semibold transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
          selectedCategory === filter.name
            ? "bg-orange-500 text-white shadow-md"
            : "bg-white text-gray-700 hover:bg-orange-100 border border-gray-200"
        }`}
        onClick={() => {
          setSelectedCategory(filter.name);
          setCurrentPage(1);
        }}
      >
        {filter.icon && <span className="mr-2">{filter.icon}</span>}
        {filter.name} {/* Si le texte doit être affiché */}
      </button>
      ))}
    </div>
  </div>

  {/* Bouton droit */}
  <button
    onClick={() => scroll(200)}
    className="relative right-0 z-10 bg-white rounded-full shadow p-2 hover:bg-orange-100"
  >
    <ChevronRight className="text-orange-500" />
  </button>
</div>


  
      {/* Menu */}
      <div className="md:pl-10">
      <h2 className="text-4xl font-bold text-orange-600 text-center mt-10 mb-10">Our Menu</h2>
  {/* Menu 
        <div className="relative mb-6 w-full">
          <input
            type="text"
            placeholder="Search an item"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border border-gray-500 focus:border-orange-500 rounded-full py-2 pl-4 pr-12 outline-none"
          />
          <button className="absolute right-0 top-0 h-full px-3 hover:text-orange-600">
            <FiSearch className="text-xl" />
          </button>
        </div>*/}
  
        <p className="font-bold text-gray-600 mb-4 ml-5">
          Showing {startIndex + 1}–{endIndex} of {totalItems} item(s)
        </p>
        <p className="text-gray-700 mb-6 ml-5">
          Explore our selection of delicious dishes made with fresh, high-quality ingredients.😋
        </p>
  
        {/* Items */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-6">
          {currentItems.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl p-4 relative flex flex-col h-[450px] justify-between">
              {Number(item.discount) > 0 && (
                <div className="absolute top-4 right-4 bg-[#FD4C2A] text-black text-sm px-1 py-1 rounded-md z-10">
                  -{Number(item.discount)}%
                </div>
              )}
              <div className="w-full h-80 bg-gray-200 rounded-2xl overflow-hidden mb-4 cursor-pointer"
                >
                <img src={item.image} alt={item.title} className="w-full h-full object-cover"onClick={() => navigate(`/client/ItemCard/${item.id}`)} />
              </div>
              <h3 className="text-sm font-medium text-gray-800">{item.title}</h3>
              <div className="flex items-center gap-2 text-sm mt-1">
                {Number(item.discount) > 0 ? (
                  <>
                    <span className="text-gray-400 line-through">
                      {(Number(item.discountedPrice) / (1 - Number(item.discount) / 100)).toFixed(2)} DH
                    </span>
                    <span className="text-black font-bold">
                      {Number(item.discountedPrice).toFixed(2)} DH
                    </span>
                  </>
                ) : (
                  <span className="text-black font-bold">{Number(item.discountedPrice).toFixed(2)} DH</span>
                )}
              </div>
              <div className="mt-4 self-end">
                <button
                  className="bg-white text-[#FD4C2A] border border-[#FD4C2A] rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold hover:bg-[#FD4C2A] hover:text-white transition"
                  onClick={() => askAddToCart(item)}
                >
                  <FaPlus className="text-sm" />
                </button>
                {showModal2 && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-xs">
            <h2 className="text-center font-semibold mb-4">Attention!</h2>
            <p className="text-center mb-6">You must be logged in to add items to your cart.</p>
            <div className="flex justify-center">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-[#FD4C2A] text-white rounded hover:bg-orange-600"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
              </div>
            </div>
          ))}
        </div>
  
        {/* Pagination */}
        <div className="mt-6 flex justify-center space-x-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
          >
            Précédent
          </button>
          <button
            disabled={endIndex >= totalItems}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 bg-[#FD4C2A] text-white rounded-lg disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      </div>
      {showModal && selectedItem && (
  <div
    id="popup-modal"
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div className="bg-white rounded-lg shadow p-6 max-w-md w-full">
  <h3 className="text-lg font-semibold text-gray-800 mb-4">
    Add "{selectedItem.title}" to cart?
  </h3>
  <div className="flex justify-end gap-3">
    <button
      onClick={confirmAddToCart}
      className="bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg px-4 py-2"
    >
      Yes, add
    </button>
    <button
      onClick={() => setShowModal(false)}
      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg px-4 py-2"
    >
      Cancel
    </button>
  </div>
</div>
  </div>
)}

    </div>
  );
  
}
