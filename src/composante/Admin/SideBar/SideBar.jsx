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
      console.error("Erreur lors de la déconnexion :", error);
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
    <div className="w-1/5 h-screen bg-[#1e1e2f] fixed left-0 top-0 overflow-y-auto z-[1000]">
      <div className="flex items-center py-20 font-bold">
        <img 
          src="/image/SmallWhiteLogoNoBg.png" 
          className="w-[100px] h-auto" 
          alt="Logo" 
        />
        <Link to="/restaurant" className="text-black text-4xl">
          <span className="text-[#FD4C2A] font-extrabold">Savory</span>
          <span className="text-white">Bites</span>
        </Link>
      </div>

      <div id="idSidebar-line" className="pt-[20%]">
        <Link 
          to="/admin/TabOrders" 
          className="flex items-center gap-[10px] py-[3%] px-[16%] text-[#FD4C2A] no-underline text-xl hover:text-white"
        >
          <FaClipboardList className="text-3xl" /> Orders
        </Link>
        <Link 
          to="/admin/Tabclient" 
          className="flex items-center gap-[10px] py-[3%] px-[16%] text-[#FD4C2A] no-underline text-xl hover:text-white"
        >
          <FaUserFriends className="text-3xl" /> Client
        </Link>
        <Link 
          to="/admin/TabRestaurant" 
          className="flex items-center gap-[10px] py-[3%] px-[16%] text-[#FD4C2A] no-underline text-xl hover:text-white"
        >
          <FaUtensils className="text-3xl" /> Restaurant
        </Link>
        <Link 
          to="/admin/Food" 
          className="flex items-center gap-[10px] py-[3%] px-[16%] text-[#FD4C2A] no-underline text-xl hover:text-white"
        >
          <RiRestaurant2Line className="text-3xl" /> Food
        </Link>
        <Link 
          to="/admin/Dashboard" 
          className="flex items-center gap-[10px] py-[3%] px-[16%] text-[#FD4C2A] no-underline text-xl hover:text-white"
        >
          <MdDashboard className="text-3xl" /> Dashboard
        </Link>
      </div>

      <div ref={menuRef} className="pt-[80%] pl-[15px] cursor-pointer">
        <div onClick={toggleMenu}>
          <FaUserCircle size={50} color="#ccc" />
        </div>

        {menuOpen && (
          <div className="absolute top-[89%] left-[17%] bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-lg overflow-hidden z-10 border border-[#FD4C2A]">
            <button
              className="p-[10px_20px] border-none bg-transparent w-full text-left cursor-pointer text-[#FD4C2A]"
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