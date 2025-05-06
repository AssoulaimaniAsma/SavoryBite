import React, { useState, useRef, useEffect } from "react";
import {
  FaBars,
  FaClipboardList,
  FaFileAlt,
  FaUserFriends,
  FaUtensils,
  FaUserCircle,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../image/favicon.png";
import "./SideBar.css";
import { RiRestaurant2Line } from "react-icons/ri";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const logout = async () => {
    try {
      const res = await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
      });

      if (res.ok){ 
        navigate("/admin/signin");}
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  // Fermer le menu profil si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      {/* Burger icon */}
      <FaBars
        className={`SIDE ${isOpen ? "white" : ""}`}
        onClick={toggleSidebar}
      />

      {/* Sidebar content */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="flex items-center py-20 space-x-2 font-bold">
          <img src={logo} className="w-12 h-12" alt="Logo" />
          <Link to="/restaurant" className="text-black text-3xl">
            <span className="text-[#FD4C2A] font-extrabold">Savory</span>Bites
          </Link>
        </div>

        <div className="sidebar-lines">
          <Link to="/admin/TabOrders" className="sidebar-line">
            <FaClipboardList className="icon" /> Orders
          </Link>
          <Link to="/admin/TabOrdersDetails" className="sidebar-line">
            <FaFileAlt className="icon" /> Orders Details
          </Link>
          <Link to="/admin/Tabclient" className="sidebar-line">
            <FaUserFriends className="icon" /> Client
          </Link>
          <Link to="/admin/TabRestaurant" className="sidebar-line">
            <FaUtensils className="icon" /> Restaurant
          </Link>
          <Link to="/admin/TabRestaurantDetails" className="sidebar-line">
            <RiRestaurant2Line className="icon" /> Restaurant Details
          </Link>
        </div>


          <div ref={menuRef} className="profile" >
            <div
              className="profile-icon"
              onClick={toggleMenu}
            >
              <FaUserCircle size={50} color="#ccc" />
            </div>

            {menuOpen && (
              <div
                className="dropdown-menu"
              >
                <button
                  className="profile-button"
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </button>
                <button
                  className="LogoutButton"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default Sidebar;
