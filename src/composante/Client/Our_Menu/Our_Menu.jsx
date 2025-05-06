// ItemCard.js
import { FiSearch } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import axios from "axios";
import { CartContext } from "../CartContext/CartContext";
import { useNavigate, Link, useSearchParams } from "react-router-dom"; // Importez useNavigate, Link et useSearchParams
import { ShoppingCart } from "lucide-react";


const moreFilters = ["American", "Asian", "Bakery & Pastry", "Shawarma"];

export default function ItemCard() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openMoreFilters, setOpenMoreFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { cart, AddToCart, showAlert, UpdateQuantity, currentItemName } = useContext(CartContext);
  const [searchParams] = useSearchParams(); // Récupérez les paramètres de l'URL
  const [popularFilters, setPopularFilters] = useState([]);
  const navigate = useNavigate(); // déjà importé
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [isAdding, setIsAdding] = useState(false);

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
          .sort((a, b) => a.name.localeCompare(b.name)); // ✅ trier alphabétiquement
          setPopularFilters(filteredAndSorted);
      })
      .catch((err) => console.error("Erreur de récupération :", err));
  }, []);
  /*const confirmAddToCart = async () => {
    const token = localStorage.getItem("authToken");
    if (!token || !selectedItem) return;
  
    try {
      AddToCart(selectedItem); // Optionnel : met à jour ton contexte/panier local
      setShowModal(false);
    } catch (err) {
      alert("Erreur lors de l'ajout au panier !");
      console.error(err);
    }
  };*/
  const [showModal2, setShowModal2] = useState(false);
  
  const askAddToCart = (item) => {
    if (isAdding) return;
  
  const token = localStorage.getItem("authToken");
  if (!token) {
    setShowModal2(true);
    return;
  }
  
  setSelectedItem(item);
  setShowModal(true);
};
const confirmAddToCart = async () => {
  setIsAdding(true);
  try {
    await AddToCart(selectedItem);
    setShowModal(false);
  } finally {
    setIsAdding(false);
  }
};
  const closeModal = () => {
    navigate("/client/signin"); // Redirect to login page
    setShowModal2(false); // Close the modal
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/public/menu")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Erreur :", error));
  }, []);
  useEffect(() => {
    if (products.length > 0) {
      console.log("Selected category changed to:", selectedCategory);
      console.log("First product categories:", products[0].categoryTitles);
      console.log("All products:", products); // Optionnel: voir toutes les données
    }
  }, [selectedCategory, products]); // Ajoutez products comme dépendance

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
  
    return inputLength === 0 
      ? [] 
      : products
          .filter(item => item.title.toLowerCase().includes(inputValue))
          .map(item => item.title);
  };
  useEffect(() => {
    console.log("Products loaded:", products.length > 0);
    if (products.length > 0) {
      console.log("First product data:", products[0]);
    }
  }, [products]);
  // Vérifiez si une catégorie est passée en paramètre et mettez à jour l'état
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && popularFilters.some(f => f.name === categoryParam)) {
      setSelectedCategory(categoryParam);
      setCurrentPage(1);
    } else if (categoryParam && moreFilters.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
      setCurrentPage(1);
    } else {
      // Si aucun paramètre valide, réinitialisez à "All" (ou gardez la valeur par défaut)
      if (!searchParams.has('category')) {
        setSelectedCategory("All");
        setCurrentPage(1);
      }
    }
  }, [searchParams]);
  console.log(products);
  const filteredProducts = products.filter((product) => {
    // Filtre par catégorie
    const categoryMatch = selectedCategory === "All" 
      ? true 
      : Array.isArray(product.categoryTitles) 
        ? product.categoryTitles.some(cat => 
            cat && cat.toString().trim().toLowerCase() === selectedCategory.trim().toLowerCase())
        : product.categoryTitles && product.categoryTitles.toString().trim().toLowerCase() === selectedCategory.trim().toLowerCase();
    
    // Filtre par terme de recherche
    const searchMatch = searchTerm === "" 
      ? true 
      : product.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    return categoryMatch && searchMatch;
  });
  const totalItems = filteredProducts.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
  const currentItems = filteredProducts.slice(startIndex, endIndex);
  const onSuggestionSelected = (value) => {
    setSearchTerm(value);
    setShowSuggestions(false);
    // Optionnel: filtrer directement les produits
    // setFilteredProducts(products.filter(p => p.title.includes(value)));
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
      <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-3 md:gap-1">
        {/* Categories Section */}
        <div className="md:w-2/3">
          <div className="ml-10 mt-20 border border-gray-200 rounded-lg p-4 w-full max-w-xs">
            <h2 className="text-xl text-[#FD4C2A] font-bold mb-3">
              <span className="text-[#FD4C2A] font-extrabold">|</span> Categories
            </h2>
            <ul className="space-y-2" style={{ left: "-50px", maxHeight: "500px", overflowY: "auto" }}>
              {popularFilters.map((filter, index) => (
                <li key={index}>
                  <button
                    className={`w-full flex items-center gap-3 p-2 rounded-lg ${
                      selectedCategory === filter.name
                        ? "bg-yellow-100 text-yellow-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setSelectedCategory(filter.name);
                      setCurrentPage(1);
                    }}
                  >
                    <span className="text-xl">{filter.icon}</span> {filter.name}
                  </button>
                </li>
              ))}
            </ul>

            {/* More Filters */}

            {openMoreFilters && (
              <ul className="mt-2 space-y-2 pl-4 text-gray-700 text-sm">
                {moreFilters.map((filter, index) => (
                  <li key={index}>
                    <button
                      className={`w-full text-left ${
                        selectedCategory === filter
                          ? "font-bold text-orange-600"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedCategory(filter);
                        setCurrentPage(1);
                      }}
                    >
                      {filter}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Menu Section */}
        <div className="md:pl-2">
          <h2 className="mt-16 text-xl  text-[#FD4C2A] md:text-4xl font-bold mb-7">Our Menu</h2>

          {/* Search Bar */}
{/* Search Bar */}
<div className="relative mb-6 w-full">
  <div className="relative">
    <input
      type="text"
      placeholder="Search An Item"
      value={searchTerm}
      onChange={(e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setCurrentPage(1);
        setSuggestions(getSuggestions(value));
        setShowSuggestions(value.length > 0);
      }}
      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      className="w-full border border-gray-500 focus:border-orange-500 rounded-full py-2 pl-4 pr-12 outline-none font-bold "
    />
    <button className="absolute right-0 top-0 h-full px-3 hover:text-orange-600">
      <FiSearch className="text-xl" />
    </button>
  </div>
  
  {showSuggestions && suggestions.length > 0 && (
    <ul className="absolute z-100 mt-1 w-full bg-white border border-gray-300 rounded-lg font-bold shadow-lg max-h-40 overflow-auto">
      {suggestions.map((suggestion, index) => (
        <li 
          key={index}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => onSuggestionSelected(suggestion)}
        >
          {suggestion}
        </li>
      ))}
    </ul>
  )}
</div>

          <p className="font-bold text-gray-600 mb-4">
            Showing {startIndex + 1}–{endIndex} of {totalItems} item(s)
          </p>
          <p className="text-gray-700 mb-6">
            Explore our selection of delicious dishes made with fresh,
            high-quality ingredients.😋 Whether you're looking for a quick bite
            or a gourmet feast, our menu has something to satisfy every craving.
          </p>

          {/* Items */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-6">
            {currentItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-4 relative flex flex-col items-start h-[450px] justify-between"
              >
                {/* Badge réduction */}
                
                {Number(item.discount) > 0 && (
  <div className="absolute top-4 right-4 bg-[#FD4C2A] text-black text-sm px-1 py-1 rounded-md z-10">
    -{Number(item.discount)}%
  </div>
)}

                

                {/* Image - verticale */}
                <div className="w-full h-80 bg-gray-200 rounded-2xl overflow-hidden mb-4"   onClick={() => navigate(`/client/ItemCard/${item.id}`)}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Nom & prix */}
                <h3 className="text-sm font-medium text-gray-800">{item.title}</h3>
                <div className="flex items-center gap-2 text-sm mt-1">
  {Number(item.discount) > 0 ? (
    <>
      <span className="text-gray-400 line-through">
        {(Number(item.discountedPrice) / (1 - Number(item.discount) / 100)).toFixed(2)}DH
      </span>
      <span className="text-black font-bold">
        {Number(item.discountedPrice).toFixed(2)}DH
      </span>
    </>
  ) : (
    <span className="text-black font-bold">
      {Number(item.discountedPrice).toFixed(2)}DH
    </span>
  )}
</div>


                {/* Bouton Ajouter */}
                <div className="mt-4 self-end">
                  <button className=" bg-white text-[#FD4C2A] border border-[#FD4C2A] rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold hover:bg-[#FD4C2A] hover:text-white transition" style={{ borderRadius: '50%' }} onClick={(e) => {
    e.stopPropagation();
    askAddToCart(item);
  }} >
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