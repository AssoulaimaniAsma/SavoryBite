import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFlag } from "react-icons/fa";

function Food() {
  const [foods, setFood] = useState([]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [foodsPerPage] = useState(4);

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
    <div className="mx-auto my-8 px-4 max-w-[1400px] w-full pl-[270px] pt-[60px] box-border">
      <h1 className="text-[#FD4C2A] text-4xl font-bold pb-5 text-center w-full">Food</h1>
      <input
        type="text"
        placeholder="Search For Food"
        value={searchQuery}
        onChange={handleSearch}
        className="px-4 py-2 border-2 border-[#FD4C2A] rounded-full w-[300px] text-base transition-all duration-300 mb-6 focus:border-[#525251] focus:shadow-[0_0_5px_rgba(82,82,81,0.3)] focus:outline-none focus:w-[320px]"
      />

      <table className="w-full border-collapse text-center mb-6 rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        <thead>
          <tr>
            <th className="bg-[#FD4C2A] text-white px-4 py-3 font-semibold">ID</th>
            <th className="bg-[#FD4C2A] text-white px-4 py-3 font-semibold">Restaurant Name</th>
            <th className="bg-[#FD4C2A] text-white px-4 py-3 font-semibold">Image</th>
            <th className="bg-[#FD4C2A] text-white px-4 py-3 font-semibold">Food Name</th>
            <th className="bg-[#FD4C2A] text-white px-4 py-3 font-semibold">Category</th>
            <th className="bg-[#FD4C2A] text-white px-4 py-3 font-semibold">Sold</th>
            <th className="bg-[#FD4C2A] text-white px-4 py-3 font-semibold">Available</th>
            <th className="bg-[#FD4C2A] text-white px-4 py-3 font-semibold">Price</th>
            <th className="bg-[#FD4C2A] text-white px-4 py-3 font-semibold">Discounted Price</th>
            <th className="bg-[#FD4C2A] text-white px-4 py-3 font-semibold">Toggle Flag</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedByRestaurant).map(([restaurantName, foods]) => (
            foods.map((food, index) => (
              <tr key={`${food.id}-${index}`} className="even:bg-[#f9f9f9] hover:bg-[#f5f5f5]">
                <td className="px-4 py-3 border-b border-[#eee] align-middle">{food.id}</td>
                
                {index === 0 && (
                  <td 
                    className="px-4 py-3 border-b border-[#eee] align-middle" 
                    rowSpan={foods.length}
                  >
                    {restaurantName}
                  </td>
                )}
                
                <td className="px-4 py-3 border-b border-[#eee] align-middle">
                  <img
                    src={food.image}
                    alt="Food"
                    className="w-20 h-20 object-cover rounded mx-auto"
                  />
                </td>
                <td className="px-4 py-3 border-b border-[#eee] align-middle">{food.title}</td>
                <td className="px-4 py-3 border-b border-[#eee] align-middle">{food.categoryTitles.join(", ")}</td>
                <td className="px-4 py-3 border-b border-[#eee] align-middle">{food.sold}</td>
                <td className="px-4 py-3 border-b border-[#eee] align-middle">{food.status}</td>
                <td className="px-4 py-3 border-b border-[#eee] align-middle">{food.price}MAD</td>
                <td className="px-4 py-3 border-b border-[#eee] align-middle">{food.discountedPrice}MAD</td>
                <td className="px-4 py-3 border-b border-[#eee] align-middle">
                  <button
                    className={`bg-transparent border-none cursor-pointer text-xl p-1 transition-transform duration-200 hover:scale-110 ${
                      food.status === "FLAGGED" ? "text-red-500" : "text-green-500"
                    }`}
                    onClick={() => handleToggleFlag(food.id)}
                    title={food.status === "FLAGGED" ? "Unflag" : "Flag"}
                  >
                    <FaFlag />
                  </button>
                </td>
              </tr>
            ))
          ))}
        </tbody>
      </table>

      <div className="flex justify-center items-center gap-2 my-6">
        <button 
          onClick={prevPage} 
          disabled={currentPage === 1}
          className="px-4 py-2 border border-[#FD4C2A] bg-white text-[#FD4C2A] rounded cursor-pointer transition-all duration-300 hover:bg-[#f8d7d0] disabled:opacity-50 disabled:cursor-not-allowed disabled:border-[#ccc] disabled:text-[#ccc]"
        >
          &laquo; Previous
        </button>
        
        {Array.from({ length: Math.ceil(filteredFoods.length / foodsPerPage) }).map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`px-4 py-2 border border-[#FD4C2A] rounded cursor-pointer transition-all duration-300 ${
              currentPage === index + 1 
                ? "bg-[#FD4C2A] text-white" 
                : "bg-white text-[#FD4C2A] hover:bg-[#f8d7d0]"
            }`}
          >
            {index + 1}
          </button>
        ))}
        
        <button 
          onClick={nextPage} 
          disabled={currentPage === Math.ceil(filteredFoods.length / foodsPerPage)}
          className="px-4 py-2 border border-[#FD4C2A] bg-white text-[#FD4C2A] rounded cursor-pointer transition-all duration-300 hover:bg-[#f8d7d0] disabled:opacity-50 disabled:cursor-not-allowed disabled:border-[#ccc] disabled:text-[#ccc]"
        >
          Next &raquo;
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
          <div className="bg-white p-8 rounded-lg text-center shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
            <p className="mb-6 text-lg">{popupMessage}</p>
            <button 
              onClick={() => setShowPopup(false)}
              className="px-4 py-2 bg-[#FD4C2A] text-white border-none rounded cursor-pointer transition-all duration-300 hover:bg-[#c03c20]"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Food;