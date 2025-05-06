// ItemCard.js
import { FiSearch } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import axios from "axios";
import { CartContext } from "../CartContext/CartContext";
import { useNavigate, Link, useSearchParams } from "react-router-dom"; // Importez useNavigate, Link et useSearchParams

const popularFilters = [
  { name: "All", icon: "🍽️" },
  { name: "Burger", icon: "🍔" },
  { name: "Plate", icon: "🍛" },
  { name: "Dessert", icon: "🍰" },
  { name: "Pasta", icon: "🍝" },
  {
    name: "Moroccan Food",
    icon: (
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Flag_of_Morocco.svg"
        alt="Maroc"
        className="w-6 h-6"
      />
    ),
  },
];

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

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Erreur :", error));
  }, []);

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

  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === "All" ||
        product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredProducts.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
  const currentItems = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="mx-auto p-5">
      {showAlert && (
        <div className="fixed-alert">
          <div className="flex items-center p-4 text-sm text-black rounded-lg bg-[#f0b9ae] dark:bg-gray-800 dark:text-blue-400" role="alert">
            <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div>
              <span className="font-medium">{currentItemName} ajouté au panier!</span>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-3 md:gap-1">
        {/* Categories Section */}
        <div className="md:w-2/3">
          <div className="ml-10 mt-20 border border-gray-200 rounded-lg p-4 w-full max-w-xs">
            <h2 className="text-xl font-bold mb-3">
              <span className="text-[#FD4C2A] font-extrabold">|</span> Categories
            </h2>
            <ul className="space-y-2">
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
            <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">
              Plus de filtres
            </h2>
            <button
              className="w-full flex justify-between items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setOpenMoreFilters(!openMoreFilters)}
            >
              Plus de filtres
              {openMoreFilters ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
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
          <h2 className="mt-16 text-xl md:text-4xl font-bold mb-7">Our Menu</h2>

          {/* Search Bar */}
          <div className="relative mb-6 w-full">
            <input
              type="text"
              placeholder="Search An Item"
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
                {item.discount && (
                  <div className="absolute top-4 right-4 bg-[#FD4C2A] text-black text-sm px-1 py-1 rounded-md z-10">
                    -{item.discount}%
                  </div>
                )}

                {/* Image - verticale */}
                <div className="w-full h-80 bg-gray-200 rounded-2xl overflow-hidden mb-4">
                  <img
                    src={`http://localhost:5001${item.image}`}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Nom & prix */}
                <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                <div className="flex items-center gap-2 text-sm mt-1">
                  <span className="text-gray-400 line-through">
                    {item.oldPrice.toFixed(2)}DH
                  </span>
                  <span className="text-black font-bold">
                    {item.newPrice.toFixed(2)}DH
                  </span>
                </div>

                {/* Bouton Ajouter */}
                <div className="mt-4 self-end">
                  <button className=" bg-white text-[#FD4C2A] border border-[#FD4C2A] rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold hover:bg-[#FD4C2A] hover:text-white transition" style={{ borderRadius: '50%' }} onClick={() => AddToCart(item)}>
                    <FaPlus className="text-sm" />
                  </button>
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
    </div>
  );
}