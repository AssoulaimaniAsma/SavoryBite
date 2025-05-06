import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaShoppingBag } from "react-icons/fa";
import Home from "./Home";
import CartPage from "./CartPage";
import logo from "../image/favicon.png";
//import "../css/Navbar.css"

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="text-[#FD4C2A]  font-bold"> 
      <img src={logo}
      className="w-15 h-10"/>
      <Link to="Home" className="relative px-4 py-2 text-black"><span className="text-[#FD4C2A]">Savory</span>Bites</Link>
      </div>

      {/* Menu */}
      <ul className="flex space-x-6 text-gray-700">
        <li>
          <Link to="/Home" className="relative px-4 py-2 text-black transition duration-300 ease-in-out 
               hover:text-white before:absolute before:inset-0 before:w-0 
               before:h-full before:bg-[#FD4C2A] before:rounded-full before:transition-all 
               before:duration-300 hover:before:w-full before:z-[-1] z-[1]">Home</Link>
        </li>
        <li className="relative">
          <button
            className="relative px-4  text-black transition duration-300 ease-in-out 
               hover:text-white before:absolute before:inset-0 before:w-0 
               before:h-full before:bg-[#FD4C2A] before:rounded-full before:transition-all 
               before:duration-300 hover:before:w-full before:z-[-1] z-[1] flex items-center"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Categories <span className="ml-1">▼</span>
          </button>
          {dropdownOpen && (
            <ul className="absolute left-0 mt-2 w-40 bg-white border shadow-lg">
              <li className="px-4 py-2 transition duration-300 ease-in-out 
               hover:text-white before:rounded-full hover:bg-[#FD4C2A]">
                <Link to="/category1">Category 1</Link>
              </li>
              <li className="px-4 py-2 transition duration-300 ease-in-out 
               hover:text-white before:rounded-full hover:bg-[#FD4C2A]">
                <Link to="/category2">Category 2</Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <Link to="/menu" className="relative px-4 py-2 text-black transition duration-300 ease-in-out 
               hover:text-white before:absolute before:inset-0 before:w-0 
               before:h-full before:bg-[#FD4C2A] before:rounded-full before:transition-all 
               before:duration-300 hover:before:w-full before:z-[-1] z-[1]">Menu</Link>
        </li>
        <li>
          <Link to="/contact" className="relative px-4 py-2 text-black transition duration-300 ease-in-out 
               hover:text-white before:absolute before:inset-0 before:w-0 
               before:h-full before:bg-[#FD4C2A] before:rounded-full before:transition-all 
               before:duration-300 hover:before:w-full before:z-[-1] z-[1]">Contact Us</Link>

        </li>
      </ul>

      {/* Icons */}
      <div className="flex items-center space-x-4 text-[#FD4C2A]">
        <FaUser className="text-xl cursor-pointer" />
        <Link to="/CartPage">
          <FaShoppingBag className="text-xl cursor-pointer" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
