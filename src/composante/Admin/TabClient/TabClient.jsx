import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaBan } from "react-icons/fa";
import ConfirmPopup from "../TabRestaurant/ConfirmPopup";

function TabClient() {
    const [clients, setClient] = useState([]);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showBanPopup, setShowBanPopup] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    const [userIdToBan, setUserIdToBan] = useState(null);
    const [clientsPerPage] = useState(5); // Changé de 8 à 5

    const filteredClients = clients.filter((client) =>
        (client.firstName ? client.firstName.toLowerCase() : "")
        .includes(searchQuery.toLowerCase()) ||
        (client.lastName ? client.lastName.toLowerCase() : "")
        .includes(searchQuery.toLowerCase()) ||
        (client.email ? client.email.toLowerCase() : "")
        .includes(searchQuery.toLowerCase()) ||
        (client.phone ? client.phone.toLowerCase() : "")
        .includes(searchQuery.toLowerCase()) ||
        (client.status ? client.status.toLowerCase() : "")
        .includes(searchQuery.toLowerCase())
    );

    const indexOfLastClient = currentPage * clientsPerPage;
    const indexOfFirstClient = indexOfLastClient - clientsPerPage;
    const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);
    const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

    useEffect(() => {
        const fetchClients = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) return navigate("/admin/login");

            try {
                const res = await fetch(`http://localhost:8080/admin/users/`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    setClient(data);
                } else {
                    const errorData = await res.json();
                    console.error("Erreur server :", errorData);
                }
            } catch (error) {
                console.error("erreur reseau ou parsing", error);
            }
        };
        fetchClients();
    }, [navigate]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleDeleteClick = (userId) => {
        setUserIdToDelete(userId);
        setShowDeletePopup(true);
    };

    const handleDeleteConfirm = async () => {
        setShowDeletePopup(false);
        if (!userIdToDelete) return;
      
        const token = localStorage.getItem("authToken");
        if (!token) {
            navigate("/admin/login");
            return;
        }
        try {
            const res = await fetch(`http://localhost:8080/admin/users/${userIdToDelete}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                console.log("User deleted successfully");
                setClient((prev) => prev.filter((client) => client.id !== userIdToDelete));
            } else {
                console.error(`Failed to delete user. Status: ${res.status}`);
                const errorText = await res.text();
                console.error("Error message:", errorText);
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleBanClick = (userId) => {
        setUserIdToBan(userId);
        setShowBanPopup(true);
    };

    const handleBanConfirm = async () => {
        setShowBanPopup(false);
        if (!userIdToBan) return;
      
        const token = localStorage.getItem("authToken");
        if (!token) {
            navigate("/admin/login");
            return;
        }
      
        try {
            const res = await fetch(`http://localhost:8080/admin/users/${userIdToBan}/toggleBan`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
      
            if (res.ok) {
                console.log("User banned/unbanned successfully");
                setClient((prevClients) =>
                    prevClients.map((client) =>
                        client.id === userIdToBan
                            ? {
                                ...client,
                                status: client.status === "BANNED" ? "VERIFIED" : "BANNED",
                            }
                            : client
                    )
                );
                const updatedClient = clients.find((client) => client.id === userIdToBan);
                if (updatedClient?.status === "BANNED") {
                    setPopupMessage("The user has been unbanned successfully.");
                } else {
                    setPopupMessage("User has been banned successfully.");
                }
                setShowPopup(true);
            } else {
                const errorText = await res.text();
                console.error("Error message:", errorText);
            }
        } catch (error) {
            console.error("Error banning/unbanning user:", error);
        }
    };

    const banMessage = clients.find(client => client.id === userIdToBan)?.status === "BANNED"
        ? "Are you sure you want to unban this user?"
        : "Are you sure you want to ban this user?";

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

    return (
        <div className="mx-auto my-8 px-4 max-w-[1400px] w-full pl-[270px] pt-[60px] box-border">
            <ConfirmPopup
                isOpen={showDeletePopup}
                message="Are you sure you want to delete this user?"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setShowDeletePopup(false)}
            />
            <ConfirmPopup
                isOpen={showBanPopup}
                message={banMessage}
                onConfirm={handleBanConfirm}
                onCancel={() => setShowBanPopup(false)}
            />
            
            <h1 className="text-[#FD4C2A] text-3xl font-bold pb-5 text-center w-full">Clients</h1>
            
            <input 
                type="text" 
                placeholder="Search For Client" 
                value={searchQuery}
                onChange={handleSearch} 
                className="px-4 py-1.5 border-2 border-[#FD4C2A] rounded-full w-[300px] text-base transition-all focus:border-gray-500 focus:shadow-[0_0_5px_rgba(82,82,81,0.3)] focus:outline-none focus:w-[320px] mb-6"
            />
            
            <div className="overflow-x-auto mb-6 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-[#FD4C2A] text-white">
                            <th className="px-4 py-3 font-semibold text-center">UserID</th>
                            <th className="px-4 py-3 font-semibold text-center">Profile Image</th>
                            <th className="px-4 py-3 font-semibold text-center">User Name</th>
                            <th className="px-4 py-3 font-semibold text-center">First Name</th>
                            <th className="px-4 py-3 font-semibold text-center">Last Name</th>
                            <th className="px-4 py-3 font-semibold text-center">Phone Number</th>
                            <th className="px-4 py-3 font-semibold text-center">Email</th>
                            <th className="px-4 py-3 font-semibold text-center">Status</th>
                            <th className="px-4 py-3 font-semibold text-center">Actions</th>
                            <th className="px-4 py-3 font-semibold text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentClients.map((client) => (
                            <tr key={client.id} className="hover:bg-gray-100 even:bg-gray-50">
                                <td className="px-4 py-3 border-b border-gray-200 text-center">{client.id}</td>
                                <td className="px-4 py-3 border-b border-gray-200">
                                    <img
                                        src={client.profileImg}
                                        alt="Profile"
                                        className="w-[50px] h-[50px] rounded-[25%] object-cover mx-auto"
                                    />
                                </td>
                                <td className="px-4 py-3 border-b border-gray-200 text-center">{client.username}</td>
                                <td className="px-4 py-3 border-b border-gray-200 text-center">{client.firstName}</td>
                                <td className="px-4 py-3 border-b border-gray-200 text-center">{client.lastName}</td>
                                <td className="px-4 py-3 border-b border-gray-200 text-center">{client.phone}</td>
                                <td className="px-4 py-3 border-b border-gray-200 text-center">{client.email}</td>
                                <td className="px-4 py-3 border-b border-gray-200 text-center">{client.status}</td>
                                <td className="px-4 py-3 border-b border-gray-200 text-center">
                                    <button
                                        className="text-red-600 underline hover:text-red-800 transition-colors flex items-center gap-1 justify-center mx-auto"
                                        onClick={() => handleDeleteClick(client.id)}
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                </td>
                                <td className="px-4 py-3 border-b border-gray-200 text-center">
                                    <button
                                        className="text-red-600 underline hover:text-red-800 transition-colors flex items-center gap-1 justify-center mx-auto"
                                        onClick={() => handleBanClick(client.id)}
                                    >
                                        <FaBan /> Ban
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
    );
}

export default TabClient;