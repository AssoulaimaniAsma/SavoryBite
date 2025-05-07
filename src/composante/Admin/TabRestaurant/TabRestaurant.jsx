import React, { useState, useEffect } from "react";
import { FaTrash, FaBan, FaCheck, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { AiOutlineClose } from "react-icons/ai";
import ConfirmPopup from './ConfirmPopup';

function TabRestaurant() {
    const [restaurants, setRestaurant] = useState([]);
    const navigate = useNavigate();
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [restaurantToDelete, setRestaurantToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [restaurantDetails, setRestaurantDetails] = useState(null);
    const [popupMessage, setPopupMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [restaurantsPerPage] = useState(5);

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
    const currentRestaurants = filteredRestaurants.slice(indexOfFirstRestaurant, indexOfLastRestaurant);
    const totalPages = Math.ceil(filteredRestaurants.length / restaurantsPerPage);

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

        try {
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
        } catch(error) {
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
        Modal.setAppElement('#root');
    }, []);

    const openModal = async (restaurant) => {
        console.log("Opening modal for restaurant:", restaurant);
        setSelectedRestaurant(restaurant);
        await fetchRestaurantDetails(restaurant.id);
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        console.log("Closing modal");
        setIsModalOpen(false);
        setSelectedRestaurant(null);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

    return (
<div className="ml-72 pr-6 pt-16 w-[calc(100%-288px)] min-h-screen lg:pl-1 lg:pr-8 md:ml-48 md:w-[calc(100%-192px)] sm:ml-0 sm:w-full sm:px-4">            <div className="mx-auto my-8 px-4 max-w-[1400px] w-full pl-[80px] pt-[30px] box-border">
                <ConfirmPopup
                    isOpen={showDeletePopup}
                    message="Are you sure you want to delete this restaurant?"
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setShowDeletePopup(false)}
                />
                
                <h1 className="text-[#FD4C2A] text-3xl font-bold pb-5 text-center w-full">Restaurants</h1>
                
                <input 
                    type="text" 
                    placeholder="Search For Restaurant" 
                    value={searchQuery}
                    onChange={handleSearch} 
                    className="px-4 py-1.5 border-2 border-[#FD4C2A] rounded-full w-[350px] text-base transition-all focus:border-gray-500 focus:shadow-[0_0_5px_rgba(82,82,81,0.3)] focus:outline-none focus:w-[400px] mb-6"
                />
                
                <div className="overflow-x-auto mb-6 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] w-full">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#FD4C2A] text-white">
                                <th className="px-4 py-3 font-semibold w-[100px]">ID</th>
                                <th className="px-4 py-3 font-semibold w-[100px]">Restaurant Name</th>
                                <th className="px-4 py-3 font-semibold w-[120px]">Phone</th>
                                <th className="px-4 py-3 font-semibold w-[120px]">Ban Status</th>
                                <th className="px-4 py-3 font-semibold w-[100px]">Action</th>
                                <th className="px-4 py-3 font-semibold w-[100px]">Delete</th>
                                <th className="px-4 py-3 font-semibold w-[80px]">Ban</th>
                                <th className="px-4 py-3 font-semibold w-[120px]">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRestaurants.map((restaurant) => (
                                <tr key={restaurant.id} className="hover:bg-gray-100 even:bg-gray-50">
                                    <td className="px-4 py-3 border-b border-gray-200">{restaurant.id}</td>
                                    <td className="px-4 py-3 border-b border-gray-200">{restaurant.title}</td>
                                    <td className="px-4 py-3 border-b border-gray-200">{restaurant.phone}</td>
                                    <td className="px-4 py-3 border-b border-gray-200">{restaurant.status}</td>
                                    <td className="px-4 py-3 border-b border-gray-200">
                                        {restaurant.status === "PENDING_APPROVAL" && (
                                            <div className="flex gap-2">
                                                <button 
                                                    className="text-green-600 hover:text-green-800 transition-colors" 
                                                    onClick={() => approveRestaurant(restaurant.id)} 
                                                    title="Approve"
                                                >
                                                    <FaCheck />
                                                </button>
                                                <button 
                                                    className="text-red-600 hover:text-red-800 transition-colors" 
                                                    onClick={() => rejectRestaurant(restaurant.id)} 
                                                    title="Reject"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 border-b border-gray-200">
                                        <button
                                            className="text-red-600 hover:text-red-800 transition-colors flex items-center gap-1"
                                            onClick={() => handleDeleteClick(restaurant.id)}
                                        >
                                            <FaTrash/> Delete
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 border-b border-gray-200">
                                        <button
                                            className="text-red-600 hover:text-red-800 transition-colors flex items-center gap-1"
                                            onClick={() => handleBan(restaurant.id)}
                                        >
                                            <FaBan/> Ban
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 border-b border-gray-200">
                                        <button 
                                            onClick={() => openModal(restaurant)} 
                                            className="text-red-600 underline hover:text-red-800 hover:no-underline transition-colors"
                                        >
                                            More Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 my-6">
                        <button 
                            onClick={prevPage} 
                            disabled={currentPage === 1}
                            className="px-4 py-2 border border-[#FD4C2A] bg-white text-[#FD4C2A] rounded transition-all hover:bg-[#f8d7d0] disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-300"
                        >
                            &laquo; Précédent
                        </button>
                        
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => paginate(index + 1)}
                                className={`px-4 py-2 rounded transition-all ${currentPage === index + 1 ? 'bg-[#FD4C2A] text-white' : 'border border-[#FD4C2A] bg-white text-[#FD4C2A] hover:bg-[#f8d7d0]'}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        
                        <button 
                            onClick={nextPage} 
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border border-[#FD4C2A] bg-white text-[#FD4C2A] rounded transition-all hover:bg-[#f8d7d0] disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-300"
                        >
                            Suivant &raquo;
                        </button>
                    </div>
                )}

                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    ariaHideApp={false}
                    contentLabel="Restaurant Details"
                    className="relative bg-white rounded-xl p-8 max-w-[90%] w-[1000px] max-h-[90vh] overflow-y-auto shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]"
                >
                    <div className="flex flex-col gap-6">
                        <button 
                            className="absolute top-4 right-4 text-[#FD4C2A] text-2xl transition-colors hover:text-[#c03c20]"
                            onClick={closeModal}
                        >
                            <AiOutlineClose />
                        </button>
                        <h2 className="text-2xl font-bold text-[#FD4C2A] text-center">Restaurant Details</h2>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[#FD4C2A] text-white">
                                        <th className="px-4 py-2">Restaurant ID</th>
                                        <th className="px-4 py-2">Profile Image</th>
                                        <th className="px-4 py-2">Restaurant Name</th>
                                        <th className="px-4 py-2">Contact Email</th>
                                        <th className="px-4 py-2">Shipping Fees</th>
                                        <th className="px-4 py-2">Address</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {restaurantDetails ? (
                                        <tr className="hover:bg-gray-100">
                                            <td className="px-4 py-2 border-b border-gray-200 text-center">{restaurantDetails.id}</td>
                                            <td className="px-4 py-2 border-b border-gray-200">
                                                <img 
                                                    src={restaurantDetails.profileImg} 
                                                    alt="Restaurant Profile" 
                                                    className="w-16 h-16 rounded-full object-cover mx-auto"
                                                />
                                            </td>
                                            <td className="px-4 py-2 border-b border-gray-200 text-center">{restaurantDetails.title}</td>
                                            <td className="px-4 py-2 border-b border-gray-200 text-center">{restaurantDetails.contactEmail}</td>
                                            <td className="px-4 py-2 border-b border-gray-200 text-center">{restaurantDetails.shippingFees}</td>
                                            <td className="px-4 py-2 border-b border-gray-200 text-center">
                                                {restaurantDetails.addressShortDTO?.title} /
                                                {restaurantDetails.addressShortDTO?.commune} /
                                                {restaurantDetails.addressShortDTO?.province} /
                                                {restaurantDetails.addressShortDTO?.region}
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-2 text-center">No details available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Modal>

                {showPopup && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
                        <div className="bg-white p-8 rounded-xl shadow-xl text-center">
                            <p className="mb-6 text-lg">{popupMessage}</p>
                            <button 
                                onClick={() => setShowPopup(false)}
                                className="px-4 py-2 bg-[#FD4C2A] text-white rounded hover:bg-[#c03c20] transition-colors"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TabRestaurant;