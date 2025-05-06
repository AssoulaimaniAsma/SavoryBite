import { Link } from "react-router-dom";
import logo from "./image/favicon.jpeg";
import { MdAdminPanelSettings } from "react-icons/md";
function ChooseRole() {
  return (
    
    <div className="flex flex-col items-center justify-start min-h-screen pt-2">
        

      {/* Logo du site */}
      <div className="flex items-center space-x-2 font-bold mt-10 mb-10">
        <img src={logo} className="w-14 h-14" alt="Logo" />
        <Link to="/restaurant" className="text-black text-3xl">
          <span className="text-[#FD4C2A] font-extrabold">Savory</span>Bites
        </Link>

        <Link to="/admin" className="text-black text-3xl">
        <MdAdminPanelSettings />

        </Link>
      </div>

      {/* Cartes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <Link to="/client/signin" className="w-96 flex flex-col items-center gap-2">
          
          <div className="w-96 h-96 overflow-hidden rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <img
              src="image/client.jpg"
              alt="Espace Client"
              className="w-full h-full object-cover rounded-lg transition-all duration-300 hover:scale-110"
            />
          </div>
          <div className="text-[#FD4C2A] font-bold text-2xl">
          Client Space
          </div>
        </Link>

        <Link to="/restaurant/SigninRestaurant" className="w-96 flex flex-col items-center gap-2">
          
          <div className="w-96 h-96 overflow-hidden rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <img
              src="/image/signinRes.jpg"
              alt="Espace Restaurant"
              className="w-full h-full object-cover rounded-lg transition-all duration-300 hover:scale-110"
            />
          </div>
          <div className="text-[#FD4C2A] font-bold text-2xl">
          Restaurant Space
                    </div>
        </Link>
      </div>
    </div>
  );
}

export default ChooseRole;
