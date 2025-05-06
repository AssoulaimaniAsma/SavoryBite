import React from "react";
import Mcdo from "../image/mcdo.png";
import Bk from "../image/burgerKing.png";
import kf from "../image/kfc.png";
import pzhut from "../image/pizzaHut.png";
import dominos from "../image/dominos.png";
import "../css/ButtonWithLogo.css";

const restaurantData = [
  { name: "McDonald’s ", img: Mcdo, bgColor: "bg-red-600", textColor: "text-white" },
  { name: "BURGER KING", img: Bk, bgColor: "bg-yellow-500", textColor: "text-black" },
  { name: "KFC Agadir", img: kf, bgColor: "bg-red-700", textColor: "text-white" },
  { name: "PIZZA HUT", img: pzhut, bgColor: "bg-black", textColor: "text-white" },
  { name: "DOMINOS", img: dominos, bgColor: "bg-blue-600", textColor: "text-white" },
];

function ButtonWithLogo() {
  return (
    <div className="buttonContainer flex flex-wrap justify-center space-x-6 mt-4">
      {restaurantData.map((restaurant, index) => (
        <div
          key={index}
          className={`flex flex-col w-60 h-60 items-center p-3 rounded-lg shadow-md ${restaurant.bgColor}`}
        >
          {/* Conteneur de l'image (2/3 de la hauteur) */}
          <div className="flex items-center justify-center h-2/3 w-full">
            <button className="w-full h-full flex items-center justify-center">
              <img
                src={restaurant.img}
                alt={restaurant.name}
                className="w-full h-full object-contain"
              />
            </button>
          </div>

          {/* Titre (1/3 de la hauteur) */}
          <div className="flex items-center justify-center h-1/3 w-full">
            <p className={`text-sm font-semibold ${restaurant.textColor}`}>
              {restaurant.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ButtonWithLogo;