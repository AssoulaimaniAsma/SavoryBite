import React, { useState, useEffect } from "react";
import "./TabRestaurant.css";
import {FaTrash, FaBan, FaCheck, FaTimes} from "react-icons/fa";
import {Link,useNavigate} from "react-router-dom";

function TabRestaurant() {
  const [restaurants, setRestaurant] = useState([]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery]=useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
          const fetchRestaurants = async () => {
              const token = localStorage.getItem("authToken");
      
              if (!token) return navigate("/admin/login");
      
              try {
                  const res = await fetch(`http://localhost:8080/admin/restaurants/`, {
                      method: "GET",
                      headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "application/json",
                      },
                  });
      
                  if (res.ok) {
                      const data = await res.json();
                      setRestaurant(data);
                  } else {
                      const errorData = await res.json();
                      console.error("Erreur server :", errorData);
                  }
              } catch (error) {
                  console.error("erreur reseau ou parsing", error);
              }
          };
      
          fetchRestaurants();
      }, [navigate]);
      
  
  
      
  
    // Handle search input change
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

      // Filter restaurants based on the search query, with safeguards for undefined values
    const filteredRestaurants = restaurants.filter((restaurant) =>
        (restaurant.title ? restaurant.title.toLowerCase() : "")
        .includes(searchQuery.toLowerCase()) ||
        (restaurant.contactEmail ? restaurant.contactEmail.toLowerCase() : "")
        .includes(searchQuery.toLowerCase()) ||
        (restaurant.phone ? restaurant.phone.toLowerCase() : "")
        .includes(searchQuery.toLowerCase()) ||
        (restaurant.status ? restaurant.status.toLowerCase() : "")
        .includes(searchQuery.toLowerCase()) 
    );

    const handleDelete = async (restaurantID) => {
        const token = localStorage.getItem("authToken");

    if (!token) return navigate("/admin/login");
        const confirmDelete = window.confirm("Are you sure you want to delete this restaurant?");
        if (!confirmDelete) return;
    
        try {
            const res = await fetch(`http://localhost:8080/admin/restaurants/${restaurantID}`, {
                method: "DELETE",
                headers:{
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                console.log("Client deleted successfully");
                setRestaurant((prev) => {
                    console.log(prev); // Vérifie l'état précédent
                    return prev.filter((restaurant) => restaurant.id !== restaurantID);
                });
            } else {
                console.error(`Failed to delete the restaurant. Status: ${res.status}`);
                const errorText =  await res.text();
                console.error("Error message:", errorText);
            }
        } catch (error) {
            console.error("Error deleting restaurant:", error);
        }
    };
    const handleBan = async (restaurantID) => {
      const token = localStorage.getItem("authToken");
      if (!token) return navigate("/admin/login");
      
      const confirmBan = window.confirm("Are you sure you want to ban this restaurant?");
      if (!confirmBan) return;
      
      try {
        const res = await fetch(`http://localhost:8080/admin/restaurants/${restaurantID}/ban`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });
        
        const text = await res.text(); // log even if not ok
        console.log("Raw response from /ban:", text);
        
        if(res.ok){
          const updatedRestaurant = restaurants.find(restaurant => restaurant.id === restaurantID);
      if (updatedRestaurant?.status === "BANNED") {
          setPopupMessage("User is already banned.");
          setShowPopup(true);
      } else {
          setRestaurant((prev) => prev.filter((restaurant) => restaurant.id !== restaurantID));
          setPopupMessage("User has been banned successfully.");
      }
      }else{
          const errorText =  await res.text();
          console.error("Error message:", errorText);
      }
      } catch (error) {
          console.error("Error banning restaurant:", error);
          setPopupMessage("An error occurred.");
          setShowPopup(true);
      }
  };
  
  
        const approveRestaurant = async (restaurantID) => {
          const token = localStorage.getItem("authToken");
        if(!token) return navigate("/admin/login");

        try{
            const res = await fetch(`http://localhost:8080/admin/restaurants/${restaurantID}/approve`,{
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if(res.ok){
                const updatedRestaurant = restaurants.find(restarant => restarant.id === restaurantID);
            if (updatedRestaurant?.Approve === "APPROVED") {
                setPopupMessage("User is already approved.");
                setShowPopup(true);
            } else if(updatedRestaurant?.Approve === "REJECTED") {
              setPopupMessage("User is already rejected.");
              setShowPopup(true);
          }
            else {
                setRestaurant((prev) => prev.filter((restaurant) => restaurant.id !== restaurantID));
                setPopupMessage("User has been approved successfully.");
            }
            }else{
                const errorText =  await res.text();
                console.error("Error message:", errorText);
            }
        }catch(error){
            console.error("Error approving restaurant :",error);
        }
        };

        const rejectRestaurant = async (restaurantID) => {
          const token = localStorage.getItem("authToken");
          if (!token) return navigate("/admin/login");
        
          try {
            const res = await fetch(`http://localhost:8080/admin/restaurants/${restaurantID}/decline`, {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
        
            if (res.ok) {
              setRestaurant((prev) =>
                prev.map((restaurant) =>
                  restaurant.id === restaurantID
                    ? { ...restaurant, status: "DECLINED" }
                    : restaurant
                )
              );
              setPopupMessage("User has been declined successfully.");
              setShowPopup(true);
            } else {
              const errorText = await res.text();
              console.error("Error message:", errorText);
            }
          } catch (error) {
            console.error("Error declining restaurant:", error);
            setPopupMessage("An error occurred.");
            setShowPopup(true);
          }
        };
        
      
  return (
    <div className="DivTableRestaurant">
      <h1 className="restaurants">Restaurants</h1>
      <input 
          type="text" 
          placeholder="Search For Client" 
          value={searchQuery}
          onChange={handleSearch} 
          className="searchBar"
      />
      <table className="TableRestaurant">
        <thead>
          <tr className="trTableRestaurant">
            <th>ID</th>
            <th>Restaurant Name</th>
            <th>Phone</th>
            <th>Contact Email</th>
            <th>Ban Status</th>
            <th>Action</th>
            <th>Delete</th>
            <th>Ban</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredRestaurants.map((restaurant) => (
            <tr key={restaurant.id}>
              <td className="tdTableRestaurant">{restaurant.id}</td>
              <td className="tdTableRestaurant">{restaurant.title}</td>
              <td className="tdTableRestaurant">{restaurant.phone}</td>
              <td className="tdTableRestaurant">{restaurant.contactEmail}</td>
              <td className="tdTableRestaurant">{restaurant.status}</td>
              <td className="tdTableRestaurant">
                {restaurant.status === "PENDING_APPROVAL" && (
                  <>
                    <button 
                      className="btn-approve" 
                      onClick={() => approveRestaurant(restaurant.id)} 
                      title="Approve"
                    >
                      <FaCheck />
                    </button>
                    <button 
                      className="btn-decline" 
                      onClick={() => rejectRestaurant(restaurant.id)} 
                      title="Reject"
                    >
                      <FaTimes />
                    </button>
                  </>
                )}
              </td>

              <td><Link className="DeleteRestaurant" onClick={()=> handleDelete(restaurant.id)}><FaTrash/>Delete</Link></td> 
              <td><Link className="BanRestaurant" onClick={()=> handleBan(restaurant.id)}><FaBan/>Ban</Link></td> 
              <td><Link to={`/admin/TabRestaurantDetails/${restaurant.id}`} className="DetailsRestaurant">Click For More Details</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
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

export default TabRestaurant;
