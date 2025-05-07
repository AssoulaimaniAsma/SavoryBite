import React, { useState, useEffect } from "react";
import { useContext } from "react";
import "./Home.css";
import MyImage from "../../../image/food.jpg";
import MyImage1 from "../../../image/burger1.jpeg";
import MyImage2 from "../../../image/pizza1.jpeg";
import MyImage3 from "../../../image/Harissa.jpeg";
import MyImage4 from "../../../image/Teriyaki.jpeg";
import back1 from "../../../image/burger.jpg";
import back2 from "../../../image/pizza.png";
import back3 from "../../../image/pasta.png";
import back4 from "../../../image/frenchfries.png";
import back5 from "../../../image/sauce.png";
import back6 from "../../../image/pizza2.png";
import ButtonWithLogo from "../ButtonWithLogo/ButtonWithLogo";
import { FiChevronDown } from "react-icons/fi";
import Mcdo from "../../../image/mcdo.png";
import logo from "../../../image/favicon.png";
import { useNavigate,Link } from "react-router-dom";
import { CartContext } from "../CartContext/CartContext";
import axios from "axios";
import picsData from "../backend/pics.json";
import { FaPlus } from "react-icons/fa";
import { ShoppingCart } from "lucide-react";

const DropdownBox = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    //The onClick={() => setIsOpen(!isOpen)} toggles the isOpen state each time the user clicks the dropdown.
    <div className="isOpenState" onClick={() => setIsOpen(!isOpen)}>
      <div className="VisiblePart">
        {/*This is where the title prop is displayed.*/}
        <span className="text-lg">{title}</span>
        {/* FichevronDown rend la flèche orientée vers le bas 
        toggle te rotation of the FichevronDown icon */}
        <FiChevronDown
          className="fleche"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </div>

      <div
        className="contentVisibility transition-all duration-500 ease-in-out"
        style={{
          height: isOpen ? "auto" : "0", // Automatically adjusts based on content
          overflow: "hidden",             // Hides content when closed
        }}
      >
          {content}
        </div>
    </div>
  );
};
function Home() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate(); // déjà importé
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
const [showModal2, setShowModal2] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8080/public/categories")
    .then((res) => {
      const filtered = res.data.filter(cat => cat.title.toLowerCase() !== "all");
      setCategories(filtered);
    })
      .catch((err) => console.error("Error loading categories:", err));
  }, []);
  const askAddToCart = (item) => {
    const token = localStorage.getItem("authToken"); // Assure-toi que le token est bien stocké sous cette clé
  
    if (!token) {
      setShowModal2(true);      return;
    }
    setSelectedItem(item);
    setShowModal(true);
  };
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/public/popularFood")
    .then((res) => {
      setPopular(res.data);
    })
      .catch((err) => console.error("Error loading popula food:", err));
  }, []);
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Récupérer les données depuis le serveur
    axios
      .get("http://localhost:8080/public/onSaleFood")
      .then((response) => {
        setItems(response.data); // Met à jour l'état avec les données reçues
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des produits:", error);
      });
  }, []);

  const section1 = items.slice(0, 4);
  const section2 = popular.slice(0, 4);
  const { cart, AddToCart, showAlert, UpdateQuantity, currentItemName } =
    useContext(CartContext);
  const [panier, setPanier] = useState([]);
  const AjouterPanier = (item) => {
    console.log(`${item.nom} ajouté au panier`);
    setPanier([...panier, item]); // Ajouter le produit au panier
  };
  const handleAddToCart = (item) => {
    AddToCart(item);
    // The setShowAlert logic is already in the CartContext, so no need to do it here again
  };
  const handleAddToCartBackend = async (item) => {
    const token = localStorage.getItem("authToken"); // Assure-toi que le token est bien stocké sous cette clé
  
    if (!token) {
      alert("Vous devez être connecté pour ajouter un article au panier.");
      return;
    }
  
    const confirm = window.confirm(`Voulez-vous ajouter "${item.title}" au panier ?`);
    if (!confirm) return;
  
    try {
      await axios.post(
        `http://localhost:8080/user/cart/addItem?foodID=${item.id}`,
        {}, // Pas besoin de corps si foodID est dans l'URL
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Anaaa sift lih")
      // Optionnel : action locale après succès
      AddToCart(item); // Met à jour le panier local/context si tu veux garder ça
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier :", error);
      alert("Erreur lors de l'ajout au panier.");
    }
  };
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
  const closeModal = () => {
    navigate("/client/signin"); // Redirect to login page
    setShowModal2(false); // Close the modal
  };

  return (
    <div className="HomeDiv">
      {showAlert && selectedItem && (
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
      <div  className="divcontent">
        {/* Titre */}
        <h1 className="h1SavoryBites">
          <span className="Savory">Savory</span>Bites - Your Favorite Meals,
          <br />
          <span className="Delivered">Delivered</span>
        </h1>

        {/* Texte descriptif */}
        <div className="adtext">
          <p className="adtext1">
            Craving something delicious? With SavoryBites, you
          </p>
          <p className="adtext2">
            can explore a variety of dishes, place your order in
          </p>
          <p className="adtext1 ">
            seconds, and enjoy fresh meals delivered straight to
          </p>
          <p className="adtext3 ">you—quick, easy, and hassle-free!</p>

          <Link
  to="/client/Our_Menu"
  className="explore relative inline-flex items-center px-12 py-3 overflow-hidden text-lg font-medium text-black border-2 border-[#FD4C2A] group"
>
  {/* Fond animé au survol - maintenant avec z-index plus bas */}
  <span className="absolute left-0 w-0 h-full transition-all duration-300 ease-out bg-[#FD4C2A] group-hover:w-full -z-10"></span>
  
  {/* Texte "Explore" - maintenant avec z-index plus haut */}
  <span className="relative text-[#FD4C2A] transition-colors duration-300 group-hover:text-white z-10">
    Explore
  </span>
  
  {/* Flèche animée */}
  <span className="absolute right-0 flex items-center justify-center w-10 h-full transform translate-x-full group-hover:translate-x-0 transition-all duration-300 ease-in-out bg-[#FD4C2A] z-10">
    <svg
      className="w-5 h-5 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      ></path>
    </svg>
  </span>
</Link>
        </div>
      </div>

      <img className="backgroundimg1" src={back1} alt="Burger background" />
      <img className="backgroundimg2" src={back2} alt="Pizza background" />

     <div className="section2">
        <h2 id="h2content">ON SALE</h2>
        <div id="imageContent">
          {section1.map((item) => (
            
            <div id="imageItem" key={item.id} >
              <span id="discountBadge">{Number(item.discount)}%</span>
              <img src={item.image} onClick={() => navigate(`/client/ItemCard/${item.id}`)}/>
              <div id="nameImg">{item.title}</div>
              <div id="PriceContainer">
                
                <div id="newPrice">{Number(item.discountedPrice).toFixed(2)}DH</div>
                <div id="oldPrice">  {(Number(item.discountedPrice) / (1 - Number(item.discount) / 100)).toFixed(2)} DH
                </div>
              </div>
              <div id="AddToCart">
                <button onClick={() => askAddToCart(item)} id="Add">
                  +
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
      </div>


      <img className="backgroundimg3" src={back3} alt="Pasta background" />

      <div className="Section3">
      {categories.length > 3 && (
  
<>
        <h2 id="h2content3">View Our Range Of Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px] p-8">
          {/* Burgers & Fast Food */}
          <div className="relative pl-[11%]" onClick={() => navigate(`/client/Our_Menu`)}>
            <img
              className="w-full h-[100%] object-cover rounded-lg"
              src={categories[0].categoryImage}
              alt=""
            />
            <div className="absolute bottom-4 left-4 pl-[11%] text-white px-[4%] py-2 text-xl font-bold">
            {categories[0].title}
            </div>
          </div>

          {/* Pizzas et Pasta */}
          <div className="flex flex-col gap-2" onClick={() => navigate(`/client/Our_Menu`)}>
            <div className="relative">
              <img
                className="w-full h-[265px] object-cover rounded-lg"
                src={categories[1].categoryImage}
                alt=""
              />
              <div className="absolute bottom-4 left-1 text-white px-4 py-2 text-xl font-bold">
              {categories[1].title}
              </div>
            </div>
            <div className="relative">
              <img
                className="w-full h-[265px] object-cover rounded-lg"
                src={categories[2].categoryImage}
                alt=""
              />
              <div className="absolute bottom-4 left-1 text-white px-4 py-2 text-xl font-bold">
              {categories[2].title}
              </div>
            </div>
          </div>

          {/* Tacos */}
          <div className="relative pr-11"onClick={() => navigate(`/client/Our_Menu`)}>
            <img
              className="w-full h-[100%] object-cover rounded-lg"
              src={categories[3].categoryImage}
              alt=""
            />
            <div className="absolute bottom-4 left-4 text-white px-4 py-2 text-xl font-bold">
              {" "}
              {categories[3].title}
            </div>
          </div>
        </div>
        </>
        )}
      </div>

      <div className="Section4">
        <h2 id="h2content1">Most Popular Products</h2>
        <div id="imageContent">
          {section2.map((item) => (
            
            <div id="imageItem" key={item.id} >
              <span id="discountBadge">{Number(item.discount)}%</span>
              <img src={item.image} onClick={() => navigate(`/client/ItemCard/${item.id}`)}/>
              <div id="nameImg">{item.title}</div>
              <div id="PriceContainer">
                
                <div id="newPrice">{Number(item.discountedPrice).toFixed(2)}DH</div>
                <div id="oldPrice">  {(Number(item.discountedPrice) / (1 - Number(item.discount) / 100)).toFixed(2)} DH
                </div>
              </div>
              <div id="AddToCart">
                <button onClick={() => askAddToCart(item)} id="Add">
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <img className="backgroundimg4" src={back4} alt="French fries" />
      <img className="backgroundimg5" src={back5} alt="Sauce" />

      <div  className="Section5">
        <h2 id="h2content2">Most Popular Restaurants</h2>
        <ButtonWithLogo />
      </div>

      <img className="backgroundimg6" src={back6} alt="Pizza background" />

      <div className="Section6 ">
        <h2 id="h2content4">Frequently Asked Questions</h2>
        <div className="container">
          <button className="AskQuestion">Ask A Question </button>
          <div className="dropdowns">
            <div className="drop1">
              <DropdownBox
                title="What is SavoryBites?"
                content="SavoryBites is a food delivery service that brings your favorite meals straight to your door."
              />
            </div>

            <div className="drop2">
              <DropdownBox
                title="How long does delivery take?"
                content="Delivery times vary depending on your location, but we strive to deliver as fast as possible!"
              />
            </div>

            <div className="drop3">
              <DropdownBox
                title="I placed an order, but would like to cancel it."
                content="We do not support canceled orders at this time."
              />
            </div>
            <div className="drop4">
              <DropdownBox
                title="My order was delivered, but the contents were damaged."
                content="We apologize that your order did not arrive as expected. Please contact the restaurant for assistance. If this does not resolve your issue, please contact our Digital Support team "
              />
            </div>
          </div>
        </div>
      </div>

      <footer className="fotterPage ">
        <div className="grid grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-8 py-10 ">
          <div className="col-span-full mb-10 2xl:col-span-2 lg:mb-0 flex items-center flex-col 2xl:items-start">
            <img
              className="mcdoLogo w-20 h-15 mb-4"
              src={logo}
              alt="McDonald's Logo"
            />
            <Link to="/" className="text-2xl font-bold">
              <span className="text-[#FD4C2A]">Savory</span>Bites
            </Link>
            <div className="flex items-center justify-between w-full max-w-xl mx-auto flex-col  2xl:flex-col 2xl:items-start">
              <p className="py-8 text-sm text-gray-500 lg:max-w-xs text-center lg:text-left">
                Trusted by food lovers across the globe. Need help? We're here
                to help!
              </p>
              <Link
                to="/client/contact"
                className="py-2.5 px-5 h-9 block w-fit bg-[#FD4C2A] rounded-full shadow-sm text-xs text-white mx-auto transition-all  duration-500 hover:bg-[#d63413] lg:mx-0"
              >
                        Contact us      {" "}
              </Link>
            </div>
          </div>

          <div className="lg:mx-auto text-left">
            <h4 className="titleLink">SavoryBites</h4>
            <ul className="text-sm  transition-all duration-500 ">
              <li className="mb-6">
                <a href="" className="link">
                  Home
                </a>
              </li>
              <li className="mb-6">
                <a href="" className="link">
                  About
                </a>
              </li>
              <li className="mb-6">
                <a href="" className="link">
                  Pricing
                </a>
              </li>
              <li>
                <a href="" className="link">
                  Features
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:mx-auto text-left">
            <h4 className="titleLink">Products</h4>
            <ul className="text-sm  transition-all duration-500">
              <li className="mb-6">
                <a href="" className="link">
                  Figma UI System
                </a>
              </li>
              <li className="mb-6">
                <a href="" className="link">
                  Icons Assets
                </a>
              </li>
              <li className="mb-6">
                <a href="" className="link">
                  Responsive Blocks
                </a>
              </li>
              <li>
                <a href="" className="link">
                  Components Library
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:mx-auto text-left">
            <h4 className="titleLink">Resources</h4>
            <ul className="text-sm  transition-all duration-500">
              <li className="mb-6">
                <a href="" className="link">
                  FAQs
                </a>
              </li>
              <li className="mb-6">
                <a href="" className="link">
                  Quick Start
                </a>
              </li>
              <li className="mb-6">
                <a href="" className="link">
                  Documentation
                </a>
              </li>
              <li>
                <a href="" className="link">
                  User Guide
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:mx-auto text-left">
            <h4 className="titleLink">Blogs</h4>
            <ul className="text-sm  transition-all duration-500">
              <li className="mb-6">
                <a href="" className="link">
                  News
                </a>
              </li>
              <li className="mb-6">
                <a href="" className="link">
                  Tips & Tricks
                </a>
              </li>
              <li className="mb-6">
                <a href="" className="link">
                  New Updates
                </a>
              </li>
              <li>
                <a href="" className="link">
                  Events
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="final_part">
          <p className="copyright">
            &copy; 2025 SavoryBites. All rights reserved.
          </p>
        </div>
      </footer>
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

export default Home;