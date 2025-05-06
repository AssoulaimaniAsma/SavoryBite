import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ItemDetails() {
  const { foodId } = useParams();
  const navigate = useNavigate();
  const [foodItem, setFoodItem] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/restaurant/SigninRestaurant");
      return;
    }

    fetch(`http://localhost:8080/restaurant/foodItem/${foodId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erreur lors du chargement des détails du plat.");
        }
        return res.json();
      })
      .then((data) => {
        setFoodItem(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Impossible de charger les données.");
      });
  }, [foodId, navigate]);

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  if (!foodItem) {
    return <div className="text-center mt-8">Chargement...</div>;
  }

  return (
    <div className="max-w-6xl w-full mx-auto mt-12 p-6">
  <div className="lg:flex bg-white border border-gray-300 rounded-xl overflow-hidden shadow-lg min-h-[500px]">

    {/* Image à gauche */}
    <div
      className="h-96 lg:h-auto lg:w-1/2 flex-none bg-cover bg-center"
      style={{ backgroundImage: `url(${foodItem.image})` }}
      title={foodItem.title}
      onError={(e) => (e.target.style.backgroundImage = "url('/fallback.png')")}
    />

    {/* Contenu texte à droite */}
    <div className="flex flex-col mt-10 justify-between p-6 leading-normal lg:w-1/2">
      <div>
        <div className="text-gray-900 font-bold text-2xl mb-2">{foodItem.title}</div>

        <div className="text-2xl font-semibold text-[#FD4C2A] mb-4">
          {foodItem.price} DA
        </div>

        <p className="text-gray-700 text-base mb-6">{foodItem.description}</p>

        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            <span className="font-semibold">Discount:</span> {foodItem.discount}%
          </li>
          <li>
            <span className="font-semibold">Available:</span>{" "}
            <span className={foodItem.isAvailable ? "text-green-600" : "text-red-600"}>
              {foodItem.isAvailable ? "Yes" : "No"}
            </span>
          </li>
          <li>
            <span className="font-semibold">Category:</span>{" "}
            {foodItem.categoryList.length > 0
              ? foodItem.categoryList.map((cat) => `${cat.categoryIcon} ${cat.title}`).join(", ")
              : "N/A"}
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>

  );
  
}
