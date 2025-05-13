import React, { useState, useRef, useEffect } from "react";
import {
  FaClipboardList,
  FaUserFriends,
  FaUtensils,
  FaUserCircle,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { RiRestaurant2Line } from "react-icons/ri";
import { MdDashboard } from "react-icons/md"; 
const Sidebar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

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
      console.error("Error during logout:", error);
    }
  };

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
<div className="w-64 h-screen bg-[#1e1e2f] fixed left-0 top-0 overflow-hidden z-[1000] flex flex-col transition-all duration-300">
{/* Logo Section */}
      <div className="flex items-center justify-center py-10 px-5">
        <img 
          src={require("./SmallWhiteLogoNoBg.png")}
          className="w-20 h-auto mr-1" 
          alt="Logo" 
        />
        <Link to="/admin/TabOrders" className="text-black">
          <span className="text-[#FD4C2A] font-extrabold text-2xl">Savory</span>
          <span className="text-white text-2xl">Bites</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 flex flex-col pt-10">
        <Link 
          to="/admin/TabOrders" 
          className="flex items-center gap-4 py-4 px-8 text-[#FD4C2A] no-underline text-xl hover:text-white hover:bg-[#2d2d42] transition-colors duration-200"
        >
          <FaClipboardList className="text-2xl" /> Orders
        </Link>
        <Link 
          to="/admin/Tabclient" 
          className="flex items-center gap-4 py-4 px-8 text-[#FD4C2A] no-underline text-xl hover:text-white hover:bg-[#2d2d42] transition-colors duration-200"
        >
          <FaUserFriends className="text-2xl" /> Clients
        </Link>
        <Link 
          to="/admin/TabRestaurant" 
          className="flex items-center gap-4 py-4 px-8 text-[#FD4C2A] no-underline text-xl hover:text-white hover:bg-[#2d2d42] transition-colors duration-200"
        >
          <FaUtensils className="text-2xl" /> Restaurants
        </Link>
        <Link 
          to="/admin/Food" 
          className="flex items-center gap-4 py-4 px-8 text-[#FD4C2A] no-underline text-xl hover:text-white hover:bg-[#2d2d42] transition-colors duration-200"
        >
          <RiRestaurant2Line className="text-2xl" /> Food
        </Link>
        <Link 
          to="/admin/Dashboard" 
          className="flex items-center gap-4 py-4 px-8 text-[#FD4C2A] no-underline text-xl hover:text-white hover:bg-[#2d2d42] transition-colors duration-200"
        >
          <MdDashboard className="text-2xl" /> Dashboard
        </Link>
      </div>

      {/* User Profile Section */}
      <div ref={menuRef} className="p-6 cursor-pointer relative mt-auto mb-8">
        <div 
          onClick={toggleMenu}
          className="flex items-center gap-4 hover:bg-[#2d2d42] p-3 rounded-lg transition-colors duration-200"
        >
          <FaUserCircle size={40} color="#ccc" />
          <span className="text-white text-lg">Admin</span>
        </div>

        {menuOpen && (
          <div className="absolute bottom-20 left-6 bg-white shadow-xl rounded-lg overflow-hidden z-10 border-2 border-[#FD4C2A] min-w-[160px]">
            <button
              className="px-6 py-3 w-full text-left hover:bg-gray-100 text-[#FD4C2A] text-lg font-medium transition-colors duration-200"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;