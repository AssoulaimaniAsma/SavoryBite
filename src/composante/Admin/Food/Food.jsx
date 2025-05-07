import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {FaFlag} from "react-icons/fa";
import "./Food.css";

function Food() {
  const [foods, setFood] = useState([]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [foodsPerPage] = useState(2);
  
    const filteredFoods = foods.filter((food) =>
        (food.id.toString().includes(searchQuery.toLowerCase())) ||
    (food.price.toString().includes(searchQuery.toLowerCase())) ||
    (food.discountedPrice.toString().includes(searchQuery.toLowerCase())) ||
      (food.title ? food.title.toLowerCase() : "")
      .includes(searchQuery.toLowerCase()) ||
      (Array.isArray(food.categoryTitles)
      ? food.categoryTitles.some(cat =>
          cat.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : false) ||
      (food.status ? food.status.toLowerCase() : "")
      .includes(searchQuery.toLowerCase()) ||
      (food.restaurant.title ? food.restaurant.title.toLowerCase() : "")
      .includes(searchQuery.toLowerCase()) 
  );
  const indexOfLastFood = currentPage * foodsPerPage;
    const indexOfFirstFood = indexOfLastFood - foodsPerPage;

    // Obtenez les commandes pour la page actuelle (en combinant avec le filtre de recherche)
    const currentFoods = filteredFoods.slice(indexOfFirstFood, indexOfLastFood);

    // Fonction pour changer de page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => {
        if (currentPage < Math.ceil(filteredFoods.length / foodsPerPage)) {
          setCurrentPage(currentPage + 1);
        }
      };
      
      const prevPage = () => {
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      };

  useEffect(() => {
    const fetchFoods = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) return navigate("/admin/login");

      try {
        const res = await fetch(`http://localhost:8080/admin/foods/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setFood(data);
        } else {
          const errorData = await res.json();
          console.error("Erreur serveur :", errorData);
        }
      } catch (error) {
        console.error("Erreur réseau ou parsing :", error);
      }
    };

    fetchFoods();
  }, [navigate]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Group by restaurant for rowspan display
  const groupedFoods = Object.entries(
    filteredFoods.reduce((acc, food) => {
      const restaurantName = food.restaurant.title;
      console.log("filtred fodds" ,filteredFoods);
      if (!acc[restaurantName]) acc[restaurantName] = [];
      acc[restaurantName].push(food);
      return acc;
    }, {})
  );

  const handleToggleFlag = async (foodID) => {
    const token = localStorage.getItem("authToken");
    if (!token) return navigate("/admin/login");
  
    try {
      const res = await fetch(`http://localhost:8080/admin/foods/${foodID}/toggleFlag`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const message = await res.text(); // ✅ avoid JSON parsing error
  
      if (!res.ok) {
        console.log("Could not toggle the flag:", message);
        return;
      }
  
      // ✅ Manually update the status in state
      setFood(prevFoods =>
        prevFoods.map(food =>
          food.id === foodID
            ? { ...food, status: food.status === "FLAGGED" ? "AVAILABLE" : "FLAGGED" }
            : food
        )
      );
  
      // Optional: show popup message
      setPopupMessage(message);
      setShowPopup(true);
  
    } catch (error) {
      console.error("Network or server error:", error);
    }
  };
  

  return (
    <div className="DivTableFood">
      <h1 className="food">Food</h1>
      <input
        type="text"
        placeholder="Search For Food"
        value={searchQuery}
        onChange={handleSearch}
        className="searchBarFood"
      />

      <table className="TableFood">
        <thead>
          <tr className="trTableFood">
            <th>ID</th>
            <th>Restaurant Name</th>
            <th>Image</th>
            <th>Food Name</th>
            <th>Category</th>
            <th>Sold</th>
            <th>Available</th>
            <th>Price</th>
            <th>Discounted Price</th>
            <th>Toggle Flag</th>
          </tr>
        </thead>
        <tbody>
          {groupedFoods.map(([restaurantName, foodList]) =>
            foodList.map((food, idx) => (
                <tr
                key={food.id}
                className={idx === foodList.length - 1 ? "last-row" : ""}
              >
              
                <td className="tdTableFood">{food.id}</td>

                {idx === 0 && (
                  <td
                    className="tdTableFood"
                    rowSpan={foodList.length}
                    style={{ verticalAlign: "middle", textAlign: "center" }}
                  >
                    {restaurantName}
                  </td>
                )}

                <td className="tdTableFood">
                  <img
                    src={food.image}
                    alt="Food"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                    }}
                    
                  />
                </td>
                <td className="tdTableFood">{food.title}</td>
                <td className="tdTableFood">{food.categoryTitles}</td>
                <td className="tdTableFood">{food.sold}</td>
                <td className="tdTableFood">{food.status}</td>
                <td className="tdTableFood">{food.price}MAD</td>
                <td className="tdTableFood">{food.discountedPrice}MAD</td>
                <td>
                    <button
                        className={`FlagFood ${food.status === "FLAGGED" ? "flagged" : "unflagged"}`}
                        onClick={() => handleToggleFlag(food.id)}
                        title={food.status === "FLAGGED" ? "Unflag" : "Flag"}
                        >
                        <FaFlag color={food.status === "FLAGGED" ? "red" : "green"} />
                    </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>
            &laquo; Précédent
        </button>
        
        {Array.from({ length: Math.ceil(filteredFoods.length / foodsPerPage) }).map((_, index) => (
            <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
            >
            {index + 1}
            </button>
        ))}
        
        <button 
            onClick={nextPage} 
            disabled={currentPage === Math.ceil(filteredFoods.length / foodsPerPage)}
        >
            Suivant &raquo;
        </button>
        </div>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>{popupMessage}</p>
            <button onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Food;
