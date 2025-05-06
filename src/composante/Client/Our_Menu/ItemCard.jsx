
  // ItemDetails.js
  import { FaShoppingCart } from "react-icons/fa";

  import React, { useEffect, useState, useContext } from "react";
  import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
  import axios from "axios";
  import { FaPlus } from "react-icons/fa";
  import { FaStar } from "react-icons/fa";
  import { CartContext } from "../CartContext/CartContext";
  import { ShoppingCart } from "lucide-react";

  import "./ItemCard.css";

  export default function ItemDetails() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [quantity, setQuantity] = useState(1); // Initialisé à 1 par défaut
    const [activeTab, setActiveTab] = useState("description");
    const [categories, setCategories] = useState([]);
    const [searchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [popularFoods, setPopularFoods] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(1);
    const [section2, setSection2] = useState([]);
    const navigate = useNavigate(); // déjà importé
    const [restaurantAddress, setRestaurantAddress] = useState(null);
const [showModal, setShowModal] = useState(false);
const [showModal2, setShowModal2] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
    const { cart, AddToCart, showAlert, UpdateQuantity, currentItemName } =
      useContext(CartContext);
    useEffect(() => {
      const fetchPopularFoods = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/public/restaurants/${item?.restaurant?.id}/food`
          );
          setPopularFoods(response.data);
        } catch (error) {
          console.error("Error fetching popular foods:", error);
        }
      };
  
      if (item?.restaurant?.id) {
        fetchPopularFoods();
      }
    }, [item]);


      // Fonction pour ajouter avec quantité (section 1)
  const addItemWithQuantity = async (item, quantity) => {
    const token = localStorage.getItem("authToken");
    if (!token || !item) return navigate("/client/login");

    try {
      AddToCart(item);
      setShowModal(false);
    } catch (err) {
      console.error("Erreur lors de l'ajout au panier:", err);
      if (err.response?.status === 401) navigate("/client/login");
    }
  };

  // Fonction pour ajouter sans quantité (autres sections)
  const addItemWithoutQuantity = async (item) => {
    const token = localStorage.getItem("authToken");
    if (!token || !item) return navigate("/client/login");

    try {
      
      AddToCart(item);
    } catch (err) {
      console.error("Erreur lors de l'ajout au panier:", err);
      if (err.response?.status === 401) navigate("/client/login");
    }
  };

  const confirmAddToCart = async () => {
    await addItemWithQuantity(selectedItem, quantity);
  };

  const askAddToCart = (item, withQuantity = false) => {
    const token = localStorage.getItem("authToken"); // Assure-toi que le token est bien stocké sous cette clé
  
    if (!token) {
      setShowModal2(true);      return;
    }
    setSelectedItem(item);
    
    if (withQuantity) {
      setShowModal(true);
    } else {
      addItemWithoutQuantity(item);
    }
  };
  const closeModal = () => {
    navigate("/client/signin"); // Redirect to login page
    setShowModal2(false); // Close the modal
  };
    useEffect(() => {
      const fetchRestaurantAddress = async () => {
        try {
          const response = await fetch(`http://localhost:8080/public/restaurants/${item?.restaurant?.id}`);
          const data = await response.json();
          const address = data.addressShortDTO;
    
          // Format address (ignore nulls)
          const fullAddress = [address.region, address.province, address.commune]
            .filter(Boolean) // remove null or undefined
            .join(", ");
    
          setRestaurantAddress(fullAddress);
        } catch (error) {
          console.error("Error fetching restaurant address:", error);
        }
      };
      if (item?.restaurant?.id) {
        fetchRestaurantAddress();
      }
    }, [item]);
    


    useEffect(() => {
      const fetchSimilarProducts = async () => {
        if (!item || categories.length === 0) return;
    
        // Trouver la bonne catégorie
        const categoryName = Array.isArray(item.categoryTitles)
          ? item.categoryTitles[0]
          : item.categoryTitles;
    
        const category = categories.find((cat) => cat.name === categoryName);
        const categoryID = category?.id;
    
        if (!categoryID) return;
    
        try {
          const response = await axios.get(
            `http://localhost:8080/public/similarProducts?categoryID=${categoryID}`
          );
          setSection2(response.data); // Tu utilises déjà section2 dans ton render
        } catch (error) {
          console.error("Error fetching similar products:", error);
        }
      };
    
      fetchSimilarProducts();
    }, [item, categories]);
    
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const response = await fetch("http://localhost:8080/public/allCategories");
          const data = await response.json();
          const formattedCategories = data
            .map((cat) => ({
              id: cat.id,
              name: cat.title,
              icon: cat.categoryIcon,
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
          setCategories(formattedCategories);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
  
      const fetchItemDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/public/menu/${id}`);
          setItem(response.data);
        } catch (error) {
          console.error("Error fetching item details:", error);
        }
      };
  
      fetchCategories();
      fetchItemDetails();
    }, [id]);
  
    useEffect(() => {
      const categoryParam = searchParams.get("category");
      setSelectedCategory(categoryParam ? decodeURIComponent(categoryParam).trim() : "All");
    }, [searchParams]);
  
    const renderRating = (rating) => {
      return Array.from({ length: 5 }).map((_, i) => (
        <FaStar
          key={i}
          className={i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}
        />
      ));
    };
  
    const handleAddToCart = () => {
      if (item) {
        AddToCart({ ...item, quantity });
      }
    };
  
    const handleQuantityChange = (value) => {
      setQuantity((prev) => Math.max(1, prev + value));
    };
  
    const handlePrev = () => {
      setCurrentSlide((prev) => (prev === 1 ? popularFoods.length - 1 : prev - 1));
    };
  
    const handleNext = () => {
      setCurrentSlide((prev) => (prev === popularFoods.length - 1 ? 1 : prev + 1));
    };
  
    if (!item) {
      return (
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  
    return (
<>
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
  <div id="Container"  className={`bg-white shadow-md rounded-lg ${
    activeTab === "description" ? "" : "mt-3"
  }`}>
    {/* Breadcrumb */}
    <section id="1" className="max-w-4xl mx-auto px-4 py-2">
    {/* Breadcrumb centré */}
    <nav className="text-sm text-gray-500 mb-7 ">
      <Link to="/client/Our_Menu" className="hover:text-[#FD4C2A]">Our Menu</Link>
      <span className="mx-1">{">"}</span>
      <Link
        to={`/client/Our_Menu?category=${encodeURIComponent(
          Array.isArray(item.categoryTitles) ? item.categoryTitles[0] : item.categoryTitles
        )}`}
        className="hover:text-[#FD4C2A]"
      >
        {Array.isArray(item.categoryTitles) ? item.categoryTitles[0] : item.categoryTitles}
      </Link>
      <span className="mx-1">{">"}</span>
      <Link to={`/client/ItemCard/${item.id}`} className="hover:text-[#FD4C2A]">{item.title}</Link>
    </nav>

    {/* Contenu principal */}
    <div className="flex flex-col md:flex-row gap-12 items-center">
      {/* Image produit */}
      <div className="md:w-1/2 rounded-lg overflow-hidden shadow-lg">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-[480px] object-cover"
          loading="lazy"
        />
      </div>

      {/* Détails produit */}
      <div className="md:w-1/2 space-y-4">
        <h2 className="text-3xl font-bold text-[#FD4C2A]">{item.title}</h2>
        
        <div className="flex items-center space-x-4">
          <p className="text-2xl font-bold text-gray-900">
            {item.discount > 0 ? (
              <>
                <span>{Number(item.discountedPrice).toFixed(2)}DH</span>
                <span className="text-lg line-through text-gray-500 ml-2">
                  {(item.discountedPrice / (1 - item.discount / 100)).toFixed(2)}DH
                </span>
              </>
            ) : `${Number(item.discountedPrice).toFixed(2)}DH`}
          </p>
          {item.rating && (
            <div className="flex items-center text-yellow-400">
              {renderRating(item.rating)}
              <span className="text-gray-600 text-sm ml-2">({item.reviewCount || 0})</span>
            </div>
          )}
        </div>

        <p className="text-gray-700 text-lg leading-relaxed">{item.description}</p>

        <ul className="space-y-3 text-gray-700">
        <li className="flex items-start">
        <span className="text-[#FD4C2A] mr-2">•</span>
            <span className="font-semibold">Category: </span>{" "}
            <span className="inline-flex items-center">
              {categories.find((cat) => cat.name == item.categoryTitles)?.icon}
              {item.categoryTitles}
            </span>
          </li>
          <li className="flex items-start">
        <span className="text-[#FD4C2A] mr-2">•</span>
            
            <span className="font-semibold">Sold : 🛒 </span>{"  "}
            
            <span className="inline-flex items-center">
               {item.sold}
            </span>
          </li>
        </ul>

        {/* Contrôles de quantité et bouton */}
        <div className="flex items-center space-x-6 pt-4">
  <div className="flex border-2 border-gray-200 rounded-full overflow-hidden">
    <button
      type="button"
      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
      className="px-4 py-3 text-gray-600 hover:bg-gray-100 text-xl"
    >
      -
    </button>
    <input
      type="text"
      value={quantity}
      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
      className="text-gray-900 bg-transparent font-bold text-center w-16 focus:outline-none text-xl flex items-center justify-center leading-none"
      min="0"
    />
    <button
      type="button"
      onClick={() => setQuantity(prev => prev + 1)}
      className="px-4 py-3 text-gray-600 hover:bg-gray-100 text-xl"
    >
      +
    </button>
  </div>
  <button
    className="bg-[#FD4C2A] hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-colors duration-300"
    onClick={() => askAddToCart(item, true)}
    >

    Add to Cart
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
    </div>
</section>
{/* ===== SECTION 2 : Restaurant + Check Also From Us ===== */}
{/* ===== SECTION 2 : Restaurant + Check Also From Us ===== */}
{activeTab === "description" && (
  
  <section id="section2" className="bg-[#DAD0CF] rounded-lg  h-screen flex flex-col">
    {/* Conteneur principal avec overflow */}
    <div className="flex-1 overflow-y-auto py-4 px-4">
      
      {/* Infos Restaurant */}
      <div className="bg-[#DAD0CF] rounded-xl overflow-hidden  max-w-6xl mx-20">
        <div className="flex items-center">
          <div className="rounded-full bg-white w-20 h-20 mr-4 flex-shrink-0">
            <img
              src={item.restaurant.profileImg}
              alt={item.restaurant.title}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <Link to={`/client/restaurants/${item.restaurant.id}`} className="hover:text-[#FD4C2A]">
              <h3 className="text-xl font-semibold text-gray-800">{item.restaurant.title}</h3>
            </Link>
            <p className="text-gray-600 text-sm">
  {restaurantAddress || "Region, Province, Commune Street"}
</p>
            <p className="text-gray-600 mt-1 text-sm leading-relaxed">
              {item.restaurant.description || "We are one of the most famous for serving our customers with the best chicken meals ever with special recipes just for you, we are well known across the world"}
            </p>
          </div>
        </div>
      </div>

      {/* Check Also From Us */}
      {popularFoods && popularFoods.length > 0 && (
        <div className="max-w-6xl mx-auto mt-5">
          <h2 className="text-xl font-semibold text-[#FD4C2A] mb-3">Check Also From Us</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {popularFoods.map((food) => (
              <div
                key={food.id}
                className="bg-[#DAD0CF] rounded-3xl p-2 relative flex flex-col items-start h-[400px] justify-between"
              >
                {Number(food.discount) > 0 && (
                  <div className="absolute top-2 right-2 bg-[#FD4C2A] text-white text-sm px-1 py-1 rounded-md z-10">
                    -{Number(food.discount)}%
                  </div>
                )}

                <div
                  className="w-full h-80 bg-[#DAD0CF] rounded-2xl overflow-hidden mb-2 cursor-pointer"
                 
                >
                  <img src={food.image} alt={food.title} className="w-full h-full object-cover"  onClick={() => navigate(`/client/ItemCard/${food.id}`)}/>
                </div>

                <h3 className="text-sm font-medium text-gray-800">{food.title}</h3>
                <div className="flex items-center gap-2 text-sm mt-1">
                  {Number(food.discount) > 0 ? (
                    <>
                      <span className="text-gray-400 line-through">
                        {(Number(food.discountedPrice) / (1 - Number(food.discount) / 100)).toFixed(2)}DH
                      </span>
                      <span className="text-black font-bold">
                        {Number(food.discountedPrice).toFixed(2)}DH
                      </span>
                    </>
                  ) : (
                    <span className="text-black font-bold">
                      {Number(food.discountedPrice).toFixed(2)}DH
                    </span>
                  )}
                </div>

                <div className="mt-1 self-end">
                  <button
                    className="bg-[#FD4C2A] text-white border border-[#FD4C2A] rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold hover:bg-[#FD4C2A] hover:text-white transition"
                    onClick={() => askAddToCart(food)}
                    >

                    <FaPlus className="text-sm" />
                  </button>
                  
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </section>
  
)}

{/* ===== SECTION 3 : Similar Food ===== */}
{section2 && section2.length > 0 && (
  <section id="3" className="max-w-6xl mx-auto mt-12">
    <h2 className="text-3xl font-semibold text-[#FD4C2A] m-6">Similar Food</h2>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
      {section2.map((food) => (
        <div
          key={food.id}
          className="bg-white rounded-3xl p-4 relative flex flex-col items-start h-[450px] justify-between"
        >
          {Number(food.discount) > 0 && (
            <div className="absolute top-4 right-4 bg-[#FD4C2A] text-white text-sm px-1 py-1 rounded-md z-10">
              -{Number(food.discount)}%
            </div>
          )}

          <div
            className="w-full h-80 bg-gray-200 rounded-2xl overflow-hidden mb-4 cursor-pointer"
            
          >
            <img src={food.image} alt={food.title} className="w-full h-full object-cover" onClick={() => navigate(`/client/ItemCard/${food.id}`)}/>
          </div>

          <h3 className="text-sm font-medium text-gray-800">{food.title}</h3>
          <div className="flex items-center gap-2 text-sm mt-1">
            {Number(food.discount) > 0 ? (
              <>
                <span className="text-gray-400 line-through">
                  {(Number(food.discountedPrice) / (1 - Number(food.discount) / 100)).toFixed(2)}DH
                </span>
                <span className="text-black font-bold">
                  {Number(food.discountedPrice).toFixed(2)}DH
                </span>
              </>
            ) : (
              <span className="text-black font-bold">
                {Number(food.discountedPrice).toFixed(2)}DH
              </span>
            )}
          </div>

          <div className="mt-4 self-end">
            <button
              className="bg-white text-[#FD4C2A] border border-[#FD4C2A] rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold hover:bg-[#FD4C2A] hover:text-white transition"
              onClick={() => askAddToCart(food)}
              >
              <FaPlus className="text-sm" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
)}

  </div>
</>

    );
  }
  