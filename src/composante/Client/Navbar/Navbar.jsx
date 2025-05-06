import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaShoppingBag } from "react-icons/fa";
import logo from "../../../image/favicon.jpeg";
import { useAuth } from "../../../contexts/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);


  // Liste des catégories
  const [categories, setCategories] = useState([]);

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
        setCategories(filteredAndSorted);
      })
      .catch((err) => console.error("Erreur de récupération :", err));
  }, []);

  // Fermer les dropdowns quand on clique à l'extérieur
  useEffect(() => {
    function handleClickOutside(event) {
      if (!userMenuRef.current?.contains(event.target)) {
        setUserMenuOpen(false);
        setActiveSubmenu(null);
      }
      if (!dropdownRef.current?.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Redirection vers une catégorie
  const handleCategoryClick = useCallback((path) => {
    navigate(path);
    setDropdownOpen(false);
  }, [navigate]);

  // Déconnexion
  const handleLogout = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      showAlertMessage("You are not connected!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: authToken }),
      });

      if (response.ok) {
        logout();
        navigate("/client/signin");
      } else {
        const errorMessage = await response.text();
        showAlertMessage(errorMessage || "Erreur lors de la déconnexion.");
      }
    } catch (error) {
      showAlertMessage("Erreur réseau.");
    }
  };

  const showAlertMessage = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  return (
    /*********<nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-8 py-4 flex justify-between items-center">
 */
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
      {/* Alert */}
      {showAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex items-center p-4 text-sm text-black rounded-lg bg-[#f0b9ae]">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <div>
              <span className="font-medium">Erreur de déconnexion : </span>{alertMessage}
            </div>
          </div>
        </div>
      )}

      {/* Logo */}
      <div className="flex items-center space-x-2 font-bold">
        <img src={logo} className="w-10 h-10" alt="Logo" />
        <Link to="/client" className="text-black text-lg">
          <span className="text-[#FD4C2A] font-extrabold">Savory</span>Bites
        </Link>
      </div>

      {/* Navigation Links */}
      <ul className="flex space-x-6 text-gray-700 font-medium">
        <li><Link to="/client" className="px-4 py-2 hover:text-[#FD4C2A]">Home</Link></li>

        <li ref={dropdownRef} className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpen(!dropdownOpen);
            }}
            className="flex items-center px-4 text-black hover:text-[#FD4C2A]"
          >
            Categories
            <svg className="ml-1 w-2.5 h-2.5 text-[#FD4C2A]" fill="currentColor" viewBox="0 0 16 10">
              <path d="M15.434 1.235A2 2 0 0 0 13.586 0H2.414A2 2 0 0 0 1 3.414L6.586 9a2 2 0 0 0 2.828 0L15 3.414a2 2 0 0 0 .434-2.179Z" />
            </svg>
          </button>
          {dropdownOpen && (
            <ul className="absolute z-10 mt-2 w-48 bg-white border border-orange-400 shadow-lg rounded-md"
    style={{ left: "-50px", maxHeight: "200px", overflowY: "auto" }}>
              {categories.map((cat, i) => (
                <li key={i} className="px-4 py-2 hover:bg-[#FD4C2A] hover:text-white flex items-center gap-2 rounded">
                  <span>{cat.icon}</span>
                  <button onClick={() => handleCategoryClick(`client/Our_Menu?category=${cat.name}`)} className="w-full text-left">
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </li>

        <li><Link to="client/Our_Menu" className="px-4 py-2 hover:text-[#FD4C2A]">Menu</Link></li>
        <li><Link to="client/contact" className="px-4 py-2 hover:text-[#FD4C2A]">Contact Us</Link></li>
      </ul>

      {/* User Menu + Cart */}
      <div className="flex items-center space-x-4 text-[#FD4C2A] relative">
        <div ref={userMenuRef} className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setUserMenuOpen(!userMenuOpen);
              setActiveSubmenu(null);
            }}
            className="p-2 rounded-full bg-orange-200 hover:bg-orange-300 transition"
          >
            <FaUser className="text-xl text-orange-700" />
          </button>
          {userMenuOpen && (
            <div className="absolute mt-2 w-40 bg-white shadow-lg rounded-md border border-orange-400" style={{ left: "-120px" }}>
              <div className="p-2">
                {isAuthenticated ? (
                  <>
                    <Link to="client/account" className="block px-4 py-2 text-black hover:text-[#FD4C2A]" onClick={() => setUserMenuOpen(false)}>Profile</Link>
                    <Link to="/client/OrderHistory" className="block px-4 py-2 text-black hover:text-[#FD4C2A]" onClick={() => setUserMenuOpen(false)}>Order History</Link>
                    <button onClick={handleLogout} className="block w-full text-black text-left px-4 py-2 hover:text-[#FD4C2A]">Logout</button>
                  </>
                ) : (
                  <>
                    {["Signin", "Signup"].map((type) => (
  <Link
    key={type}
    to={`client/${type.toLowerCase()}`}
    className="block px-4 py-2 hover:bg-gray-100"
    onClick={() => setUserMenuOpen(false)}
  >
    {type} 
  </Link>
))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <Link to="client/CartPage">
          <FaShoppingBag className="text-xl text-orange-700 hover:text-orange-500 transition" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
