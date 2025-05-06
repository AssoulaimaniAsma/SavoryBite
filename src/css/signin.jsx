import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; 
import "../css/signin.css";

function Signin() {
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [reverseLayout, setReverseLayout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const handleLogin = () => {
    // Ici, vous pouvez ajouter la logique de connexion (ex: vérification d'identifiants)
    console.log("User logged in");
    
    // Rediriger vers la page Home
    navigate("/home");
  };
  return (
    <div>
      {loading ? (
        <div className="loader-container">
          <div className="spinner"> 
            <img src={require("../image/Pizza.gif")} alt="Loading..." /> 
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen bg-white px-4">
          <div className={`max-w-4xl w-full bg-white grid grid-cols-1 md:grid-cols-2 shadow-lg rounded-lg overflow-hidden transition-transform duration-500 ${reverseLayout ? 'md:flex-row-reverse' : ''}`}>
            
            {/* Formulaire */}
            <div className="p-8">
              <h2 className="text-3xl font-bold text-black">Login</h2>
              <p className="text-gray-600 mt-2">
                Do not have an account,{" "}
                <Link to="./signup" onClick={() => setReverseLayout(!reverseLayout)} className="text-[#FD4C2A] font-medium underline">
                  create a new one.
                </Link>
              </p>

              {/* Champ Email */}
              <div className="mt-6">
                <label className="block text-gray-700">Enter Your Email Or Phone</label>
                <input
                  type="email"
                  placeholder="exemple@exemple.com"
                  className="w-full mt-2 p-3 border-2 border-[#FD4C2A] rounded-full bg-gray-50 focus:outline-none"
                />
              </div>

              {/* Mot de passe */}
              <div className="mt-4 relative">
                <label className="block text-gray-700">Enter Your Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="******"
                  className="w-full mt-2 p-3 border-2 border-gray-300 rounded-full bg-gray-50 focus:outline-none"
                />
                <span
                  className="absolute top-10 right-4 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {/* Bouton Login */}
              <button onClick={handleLogin} 
              className="w-full mt-6 bg-[#FD4C2A] text-white py-3 rounded-full font-bold text-lg hover:bg-orange-600 transition">
                Login
              </button>

              {/* Oublie mot de passe */}
              <p className="text-center mt-4">
                <a href="#" className="text-[#FD4C2A] font-medium underline">
                  Forgot Your Password
                </a>
              </p>
            </div>

            {/* L'image */}
            <div className="hidden md:block">
              <img id="image"src={require("../image/signin.jfif")} alt="Food" className="w-full h-full object-cover"/>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signin;
