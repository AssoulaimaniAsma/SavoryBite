import React, { useState, useEffect } from "react";
import "./TabRestaurant.css";
import {FaTrash, FaBan, FaCheck, FaTimes} from "react-icons/fa";
import {Link,useNavigate} from "react-router-dom";
import Modal from "react-modal";
import { AiOutlineClose } from "react-icons/ai";
import ConfirmPopup from './ConfirmPopup';
function TabRestaurant() {
  const [restaurants, setRestaurant] = useState([]);
  const navigate = useNavigate();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
const [restaurantToDelete, setRestaurantToDelete] = useState(null);
  const [searchQuery, setSearchQuery]=useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [restaurantsPerPage] = useState(8);
  // Filter restaurants based on the search query, with safeguards for undefined values
  const filteredRestaurants = restaurants.filter((restaurant) =>
    (restaurant.id.toString().includes(searchQuery.toLowerCase())) ||
  (restaurant.phone.toString().includes(searchQuery.toLowerCase())) ||
    (restaurant.title ? restaurant.title.toLowerCase() : "")
    .includes(searchQuery.toLowerCase()) ||
    (restaurant.contactEmail ? restaurant.contactEmail.toLowerCase() : "")
    .includes(searchQuery.toLowerCase()) ||
    (restaurant.phone ? restaurant.phone.toLowerCase() : "")
    .includes(searchQuery.toLowerCase()) ||
    (restaurant.status ? restaurant.status.toLowerCase() : "")
    .includes(searchQuery.toLowerCase()) 
);
    const indexOfLastRestaurant = currentPage * restaurantsPerPage;
    const indexOfFirstRestaurant = indexOfLastRestaurant - restaurantsPerPage;

    // Obtenez les commandes pour la page actuelle (en combinant avec le filtre de recherche)
    const currentRestaurants = filteredRestaurants.slice(indexOfFirstRestaurant, indexOfLastRestaurant);

    // Fonction pour changer de page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => {
        if (currentPage < Math.ceil(filteredRestaurants.length / restaurantsPerPage)) {
          setCurrentPage(currentPage + 1);
        }
      };
      
      const prevPage = () => {
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      };
  
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
          useEffect(() => {
          fetchRestaurants();
      }, [navigate]);
      
  
  
      
  
    // Handle search input change
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleDeleteClick = (restaurantID) => {
      setRestaurantToDelete(restaurantID);
      setShowDeletePopup(true);
    };
    
    const handleDeleteConfirm = async () => {
      setShowDeletePopup(false);
      if (!restaurantToDelete) return;
    
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/admin/login");
        return;
      }
    
      try {
        const res = await fetch(`http://localhost:8080/admin/restaurants/${restaurantToDelete}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        if (res.ok) {
          setPopupMessage("✅ Restaurant deleted successfully");
          setShowPopup(true);
          setRestaurant(prev => prev.filter(r => r.id !== restaurantToDelete));
        } else {
          const errorText = await res.text();
          throw new Error(errorText || "Failed to delete restaurant");
        }
      } catch (error) {
        console.error("Delete error:", error);
        setPopupMessage(`❌ ${error.message || "Failed to delete restaurant"}`);
        setShowPopup(true);
      } finally {
        setRestaurantToDelete(null);
      }
    };
    const fetchRestaurantDetails = async (restaurantID) => {
      const token = localStorage.getItem("authToken");
      if (!token) return navigate("/admin/login");
    
      try {
        const res = await fetch(`http://localhost:8080/admin/restaurants/${restaurantID}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
    
        if (res.ok) {
          const data = await res.json();
          setRestaurantDetails(data);
        } else {
          const errorData = await res.json();
          console.error("Server Error:", errorData);
        }
      } catch (error) {
        console.error("Network or Parsing Error", error);
      }
    };
    
    const handleBan = async (restaurantID) => {
      const token = localStorage.getItem("authToken");
      if (!token) return navigate("/admin/login");
    
      const currentRestaurant = restaurants.find(r => r.id === restaurantID);
      const action = currentRestaurant?.status === "BANNED" ? "unban" : "ban";

    
      try {
        const res = await fetch(`http://localhost:8080/admin/restaurants/${restaurantID}/ban`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });
    
        if (!res.ok) throw new Error(await res.text() || "Failed to update status");
    
        const successMessage = await res.text();
        
        setRestaurant(prev => prev.map(r => 
          r.id === restaurantID 
            ? { ...r, status: action === "ban" ? "BANNED" : "VERIFIED" } 
            : r
        ));
    
        setPopupMessage(`✅ ${successMessage}`);
        setShowPopup(true);
    
      } catch (error) {
        setPopupMessage(`❌ ${error.message || "Operation failed"}`);
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
              if (res.ok) {
                const updatedRes = await fetch(`http://localhost:8080/admin/restaurants/${restaurantID}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                if (updatedRes.ok) {
                    const updatedRestaurant = await updatedRes.json();
                    setRestaurant(prev =>
                        prev.map(r => r.id === restaurantID ? updatedRestaurant : r)
                    );
                }
                setPopupMessage("User has been approved successfully.");
                setShowPopup(true);
                fetchRestaurants();
            } else {
                console.error("Failed to fetch updated restaurant");
                setPopupMessage("Failed to approve restaurant.");
                setShowPopup(true);
            }
        }catch(error){
            console.error("Error approving restaurant :",error);
            setPopupMessage("An error occured while approving");
            setShowPopup(true);
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
              fetchRestaurants();
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
        
        useEffect(() => {
                Modal.setAppElement('#root'); // Set the app element for accessibility
              }, []);

        const openModal = async (restaurant) => {
          console.log("Opening modal for restaurant:", restaurant); // Check if this is logged when clicking
          setSelectedRestaurant(restaurant);
          await fetchRestaurantDetails(restaurant.id);
          setIsModalOpen(true);
        };
        
        const closeModal = () => {
          console.log("Closing modal");
          setIsModalOpen(false);
          setSelectedRestaurant(null);
        };
        
      
  return (
    <div className="DivTableRestaurant">
      <ConfirmPopup
        isOpen={showDeletePopup}
        message="Are you sure you want to delete this restaurant?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeletePopup(false)}
      />
      <h1 className="restaurants">Restaurants</h1>
      <input 
          type="text" 
          placeholder="Search For Restaurant" 
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
          {currentRestaurants.map((restaurant) => (
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

              <td><Link className="DeleteRestaurant" onClick={()=> handleDeleteClick(restaurant.id)}><FaTrash/>Delete</Link></td> 
              <td><Link className="BanRestaurant" onClick={()=> handleBan(restaurant.id)}><FaBan/>Ban</Link></td> 
              <td><button onClick={() => openModal(restaurant)} className="DetailsRestaurant"> More Details</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>
            &laquo; Précédent
        </button>
        
        {Array.from({ length: Math.ceil(filteredRestaurants.length / restaurantsPerPage) }).map((_, index) => (
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
            disabled={currentPage === Math.ceil(filteredRestaurants.length / restaurantsPerPage)}
        >
            Suivant &raquo;
        </button>
        </div>
      {selectedRestaurant && (
                <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                ariaHideApp={false}
              contentLabel="restaurant Details"
              style={{
                  content: {
                    border: '1px solid #ccc',          // thinner, subtle border
                    padding: '2rem',
                    borderRadius: '10px',
                    marginLeft:'10%',
                    background: '#fff',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    width: '70%',  
                    height: 'auto',                    // adjust based on content
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    transform: 'translate(-50%, -50%)', // perfect centering
                  },
                  overlay: {
                    backgroundColor: 'rgba(228, 228, 228, 0.5)'
                  }
              }}
                
            >
              <div className="RestaurantDetails">
              <button className="Close" onClick={closeModal}><AiOutlineClose/></button>
              <br/><br/>
                <h2 className="RestaurantDetailsh2" >Restaurant Details</h2>
                <table className="TableRestaurantDetails">
                        <thead>
                            <tr className="trRestaurantDetails">
                                <th>Restaurant ID</th>
                                <th>Profile Image</th>
                                <th>Restaurant Name</th>
                                <th>Shipping Fees</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
          {restaurantDetails ? (
            <tr>
              <td className="tdRestaurantDetails">{restaurantDetails.id}</td>
              <td className="tdRestaurantDetails">
                <img 
                  src={restaurantDetails.profileImg} 
                  alt="Restaurant Profile" 
                  className="restaurant-profile-img" 
                />
              </td>
              <td className="tdRestaurantDetails">{restaurantDetails.title}</td>
              <td className="tdRestaurantDetails">{restaurantDetails.shippingFees}</td>
              <td className="tdRestaurantDetails">
                {restaurantDetails.addressShortDTO?.title} /
                {restaurantDetails.addressShortDTO?.commune} /
                {restaurantDetails.addressShortDTO?.province} /
                {restaurantDetails.addressShortDTO?.region}
              </td>
            </tr>
          ) : (
            <tr>
              <td colSpan="5">No details available</td>
            </tr>
          )}
        </tbody>
                </table>
                
            </div>
              </Modal>
            )}
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
