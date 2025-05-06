import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // Import Framer Motion
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../css/signup.css";

function Signup() {
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-white px-4">
      <motion.div 
        className="max-w-4xl w-full bg-white grid grid-cols-1 md:grid-cols-2 shadow-lg rounded-lg overflow-hidden"
        initial={{ opacity: 0, x: -100 }} // Départ
        animate={{ opacity: 1, x: 0 }} // Animation active
        exit={{ opacity: 0, x: 100 }} // Disparition
        transition={{ duration: 0.5 }}
      >
        {/* ( à gauche) */}
        <motion.div 
          className="hidden md:block order-1 "
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img id="image" src={require("../image/signin.jfif")} alt="Food" className="w-full h-full object-cover" />
        </motion.div>

        {/*  ( à droite) */}
        <motion.div 
          className="p-8 order-2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-black">Sign up</h2>
          <p className="text-gray-600 mt-2">
            Already have an Account?{" "}
            <Link 
              to="../" 
              className="text-[#FD4C2A] font-medium underline"
            >
              Login.
            </Link>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-gray-700">Full Name</label>
              <input type="text" placeholder="Enter your Full name" className="w-full mt-2 p-3 border-2 border-[#FD4C2A] rounded-full bg-gray-50 focus:outline-none"/>
            </div>

            <div>
              <label className="block text-gray-700">Email</label>
              <input type="email" placeholder="exemple@exemple.com" className="w-full mt-2 p-3 border-2 border-[#FD4C2A] rounded-full bg-gray-50 focus:outline-none"/>
            </div>

            <div className="relative">
              <label className="block text-gray-700">Password</label>
              <input type={showPassword ? "text" : "password"} placeholder="******" className="w-full mt-2 p-3 border-2 border-gray-300 rounded-full bg-gray-50 focus:outline-none"/>
              <span className="absolute top-10 right-4 text-gray-500 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="relative">
              <label className="block text-gray-700">Confirm Password</label>
              <input type={showConfirmPassword ? "text" : "password"} placeholder="******" className="w-full mt-2 p-3 border-2 border-gray-300 rounded-full bg-gray-50 focus:outline-none"/>
              <span className="absolute top-10 right-4 text-gray-500 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="flex items-center mt-4">
            <input type="checkbox" id="terms" className="mr-2"/>
            <label htmlFor="terms" className="text-gray-700 text-sm">I have read and agreed to the Terms of Service and Privacy Policy</label>
          </div>

          <button 
            className="w-full mt-6 bg-[#FD4C2A] text-white py-3 rounded-full font-bold text-lg hover:bg-orange-600 transition"
          >
            Create Account
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Signup;
