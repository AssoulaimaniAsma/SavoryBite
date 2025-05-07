import React ,{useState,useEffect}from "react";
import "./TabClient.css";
import { FaTrash } from "react-icons/fa";
import { FaBan } from "react-icons/fa";
import { Link,useNavigate } from "react-router-dom";
import ConfirmPopup from "../TabRestaurant/ConfirmPopup";

function TabClient(){
    const [clients, setClient]= useState([]);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery]=useState("");
    const [username, setUsername] = useState("");
    const [profileImg,setProfileImg]=useState("");
    const [phone,setPhone]=useState("");
    const [firstName,setFirstName]=useState("");
    const [lastName,setLastName]=useState("");
    const [status,setStatus]=useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showBanPopup, setShowBanPopup] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    const [userIdToBan, setUserIdToBan] = useState(null);
    const [clientsPerPage] = useState(5);
      // Filter clients based on the search query, with safeguards for undefined values
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

    // Obtenez les commandes pour la page actuelle (en combinant avec le filtre de recherche)
    const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

    // Fonction pour changer de page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => {
        if (currentPage < Math.ceil(filteredClients.length / clientsPerPage)) {
          setCurrentPage(currentPage + 1);
        }
      };
      
      const prevPage = () => {
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      };

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
    


    

            // Handle search input change
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
                        headers:{
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (res.ok) {
                        console.log("User deleted successfully");
                        setClient((prev) => {
                            console.log(prev); // Vérifie l'état précédent
                            return prev.filter((client) => client.id !== userIdToDelete);
                        });
                    } else {
                        console.error(`Failed to delete user. Status: ${res.status}`);
                        const errorText =  await res.text();
                        console.error("Error message:", errorText);
                    }
                } catch (error) {
                    console.error("Error deleting user:", error);
                }
            };
            const handleBanClick = (userId) => {
                setUserIdToBan(userId); // Store user ID to ban/unban
                setShowBanPopup(true);   // Show popup for confirmation
              };
              
              const handleBanConfirm = async () => {
                setShowBanPopup(false);  // Hide the popup
                if (!userIdToBan) return;  // If no user to ban/unban, return
              
                const token = localStorage.getItem("authToken");
                if (!token) {
                  navigate("/admin/login");
                  return;
                }
              
                try {
                  // API request to toggle ban (ban or unban)
                  const res = await fetch(`http://localhost:8080/admin/users/${userIdToBan}/toggleBan`, {
                    method: "PUT",
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });
              
                  if (res.ok) {
                    console.log("User banned/unbanned successfully");
              
                    // Update client state after ban/unban operation
                    setClient((prevClients) =>
                      prevClients.map((client) =>
                        client.id === userIdToBan
                          ? {
                              ...client,
                              status: client.status === "BANNED" ? "VERIFIED" : "BANNED", // Toggle status
                            }
                          : client
                      )
                    );
              
                    // Show appropriate popup message after ban/unban
                    const updatedClient = clients.find((client) => client.id === userIdToBan);
                    if (updatedClient?.status === "BANNED") {
                      setPopupMessage("The user has been unbanned successfully.");
                      setShowPopup(true);
                    } else {
                      setPopupMessage("User has been banned successfully.");
                      setShowPopup(true);
                    }
                  } else {
                    const errorText = await res.text();
                    console.error("Error message:", errorText);
                  }
                } catch (error) {
                  console.error("Error banning/unbanning user:", error);
                }
              };
              
              const banMessage = clients.find(client => client.id === userIdToBan)?.status === "BANNED"
              ? "Are you sure you want to unban this restaurant?"
              : "Are you sure you want to ban this restaurant?";


    return(
        <div className="DivTableClient">
            <ConfirmPopup
                    isOpen={showDeletePopup}
                    message="Are you sure you want to delete this restaurant?"
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setShowDeletePopup(false)}
                  />
            <ConfirmPopup
                    isOpen={showBanPopup}
                    message={banMessage}
                    onConfirm={handleBanConfirm}
                    onCancel={() => setShowBanPopup(false)}
                  />
            <h1 className="Clients">Clients</h1>
            <input 
                type="text" 
                placeholder="Search For Client" 
                value={searchQuery}
                onChange={handleSearch} 
                className="searchBar"
            />
            <table className="TableClient">
                <thead>
                    <tr className="trTableClient">
                        <th>UserID</th>
                        <th>Profile Image</th>
                        <th>User Name</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Phone Number</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                {currentClients.map((client) => (
                        <tr className="trTableClient2" key={client.id}>
                            <td className="tdTableClient">{client.id}</td>
                            <td className="tdTableClient">
                                <img
                                    src={client.profileImg}
                                    alt="Profile"
                                    style={{ width: "50px",height:"50px", borderRadius: "25%",objectFit: "cover", marginLeft:"49px" }}
                                />
                            </td>
                            <td className="tdTableClient">{client.username}</td>
                            <td className="tdTableClient">{client.firstName}</td>
                            <td className="tdTableClient">{client.lastName}</td>
                            <td className="tdTableClient">{client.phone}</td>
                            <td className="tdTableClient">{client.email}</td>
                            <td className="tdTableClient">{client.status}</td>
                            <td className="tdTableClient">
                                <Link
                                    className="LinkDeleteClient"
                                    onClick={() => handleDeleteClick(client.id)}
                                >
                                    <FaTrash /> Delete
                                </Link>
                            </td>
                            <td className="tdTableClient">
                                <Link
                                    className="LinkDeleteClient"
                                    onClick={() => handleBanClick(client.id)}
                                >
                                    <FaBan/> Ban
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
            <button onClick={prevPage} disabled={currentPage === 1}>
                &laquo; Précédent
            </button>
            
            {Array.from({ length: Math.ceil(filteredClients.length / clientsPerPage) }).map((_, index) => (
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
                disabled={currentPage === Math.ceil(filteredClients.length / clientsPerPage)}
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
export default TabClient; 