import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function ButtonWithLogo() {
  const [restaurants, setRestaurants] = useState([]);
  const navigate= useNavigate();
  useEffect(() => {
    axios.get("http://localhost:8080/public/popularRestaurant")
      .then(response => {
        setRestaurants(response.data);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des restaurants :", error);
      });
  }, []);

  return (
    <div className="buttonContainer flex flex-wrap justify-center gap-6 mt-4">
      {restaurants.map((restaurant) => (
        <div
  key={restaurant.id}
  className="flex flex-col w-60 h-60 items-center p-3 rounded-lg shadow-md bg-white"
>
  <div className="flex items-center justify-center h-2/3 w-full">
    <button
      onClick={() => navigate(`/client/restaurants/${restaurant.id}`)}
      className="w-full h-full flex items-center justify-center"
    >
      <img
        src={restaurant.profileImg}
        alt={restaurant.title}
        className="w-full h-full object-cover"
      />
    </button>
  </div>

  <div className="flex items-center justify-center h-1/3 w-full">
    <p className="text-sm font-semibold text-black">{restaurant.title}</p>
  </div>
</div>

      ))}
    </div>
  );
}

export default ButtonWithLogo;
