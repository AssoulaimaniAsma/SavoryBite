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
  const [foodsPerPage] = useState(5);

  // Filter function
  const filterFoods = (foods) => {
    return foods.filter((food) =>
      (food.id.toString().includes(searchQuery.toLowerCase())) ||
      (food.price.toString().includes(searchQuery.toLowerCase())) ||
      (food.discountedPrice.toString().includes(searchQuery.toLowerCase())) ||
      (food.title ? food.title.toLowerCase() : "").includes(searchQuery.toLowerCase()) ||
      (Array.isArray(food.categoryTitles) ? 
        food.categoryTitles.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
        : false) ||
      (food.status ? food.status.toLowerCase() : "").includes(searchQuery.toLowerCase()) ||
      (food.restaurant.title ? food.restaurant.title.toLowerCase() : "").includes(searchQuery.toLowerCase()) 
    );
  };

  // Calculate filtered foods
  const filteredFoods = filterFoods(foods);

  // Pagination calculations
  const indexOfLastFood = currentPage * foodsPerPage;
  const indexOfFirstFood = indexOfLastFood - foodsPerPage;
  const currentFoods = filteredFoods.slice(indexOfFirstFood, indexOfLastFood);

  // Group foods by restaurant for display
  const groupedByRestaurant = currentFoods.reduce((acc, food) => {
    const restaurantName = food.restaurant.title;
    if (!acc[restaurantName]) acc[restaurantName] = [];
    acc[restaurantName].push(food);
    return acc;
  }, {});

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
          console.error("Server error:", errorData);
        }
      } catch (error) {
        console.error("Network or parsing error:", error);
      }
    };

    fetchFoods();
  }, [navigate]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

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
  
      const message = await res.text();
  
      if (!res.ok) {
        console.log("Could not toggle the flag:", message);
        return;
      }
  
      setFood(prevFoods =>
        prevFoods.map(food =>
          food.id === foodID
            ? { ...food, status: food.status === "FLAGGED" ? "AVAILABLE" : "FLAGGED" }
            : food
        )
      );
  
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
          {Object.entries(groupedByRestaurant).map(([restaurantName, foods]) => (
            foods.map((food, index) => (
              <tr key={`${food.id}-${index}`}>
                <td className="tdTableFood">{food.id}</td>
                
                {index === 0 && (
                  <td 
                    className="tdTableFood" 
                    rowSpan={foods.length}
                    style={{ verticalAlign: 'middle' }}
                  >
                    {restaurantName}
                  </td>
                )}
                
                <td className="tdTableFood">
                  <img
                    src={food.image}
                    alt="Food"
                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  />
                </td>
                <td className="tdTableFood">{food.title}</td>
                <td className="tdTableFood">{food.categoryTitles.join(", ")}</td>
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
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>
          &laquo; Previous
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
          Next &raquo;
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