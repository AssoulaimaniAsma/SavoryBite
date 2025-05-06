import React, { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrash, FaInfoCircle, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function Menu_Restaurant() {
  const [foodItems, setFoodItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      axios.get('http://localhost:8080/restaurant/foodItem/', {
        //Job of this header in each request:It proves the identity of the client (like a logged-in user) to the server so the server knows who is making the request and whether they have permission.
        // The Authorization header is used to send authentication credentials to the server
        //Bearer ${token} is the value of the Authorization header
        //the token value usually containsa jwt
        headers: { Authorization: `Bearer ${token}` },
      })
      //If the request is successful, it sets the fetched data (probably a list of food items) using setFoodItems
        .then((res) => {
          setFoodItems(res.data);
        })
        .catch((err) => {
          console.error("Erreur lors du fetch des données:", err);
        });
    }

    if (location.state?.reload) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state?.reload]);

  useEffect(() => {
    if (alert.message) {
      const timeout = setTimeout(() => {
        setAlert({ type: "", message: "" });
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [alert]);

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(`http://localhost:8080/restaurant/foodItem/${itemToDelete}/delete`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFoodItems(prev => prev.filter(item => item.id !== itemToDelete));
      setAlert({ type: "success", message: "Item deleted successfully." });
    } catch (err) {
      console.error(err);
      setAlert({ type: "error", message: "Error deleting item." });
    } finally {
      setShowModal(false);
      setItemToDelete(null);
    }
  };

  const handleAvailabilityToggle = async (itemId,foodTitle, currentAvailability) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(`http://localhost:8080/restaurant/foodItem/${itemId}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFoodItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, isAvailable: !currentAvailability } : item
        )
      );
      setAlert({
        type: "success",
        message: `Availability of ${foodTitle} updated to ${!currentAvailability ? 'Enable' : 'Disable'}.`,
      });
    } catch (error) {
      console.error("Error toggling availability:", error);
      setAlert({ type: "error", message: "Failed to update availability." });
    }
  };

  const filteredItems = foodItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredItems.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            {alert.message && (
              <div
                className={`p-4 mb-4 mx-4 mt-6 text-sm rounded-lg shadow transition-all duration-300 ${
                  alert.type === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {alert.message}
              </div>
            )}

            <div className="flex justify-between items-center mt-10">
              {/* Search */}
              <div className="relative text-[#FD4C2A] focus-within:text-gray-600">
                <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                  <FaSearch className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-64 h-9 pl-8 pr-3 text-sm bg-white border border-[#FD4C2A] rounded-full placeholder-[#FD4C2A] focus:outline-none focus:ring-1 focus:ring-gray-300"
                  placeholder="Search food"
                />
              </div>

              {/* Add button */}
              <Link to="/restaurant/addfood">
                <button className="group flex items-center gap-2 p-2 text-sm font-medium text-white bg-[#FD4C2A] hover:bg-[#FD4C2A] rounded-full transition-all duration-300 hover:px-4">
                  <FaPlus className="text-lg" />
                  <span className="opacity-0 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-auto transition-all duration-300 whitespace-nowrap">
                    Add item
                  </span>
                </button>
              </Link>
            </div>

            {/* Table */}
            <div className="overflow-hidden mt-10">
              <table className="min-w-full rounded-xl">
                <thead>
                  <tr className="bg-[#FD4C2A]">
                    <th className="p-5 text-left text-white text-sm font-semibold rounded-tl-lg">Image</th>
                    <th className="p-5 text-left text-white text-sm font-semibold">Title</th>
                    <th className="p-5 text-left text-white text-sm font-semibold">Price</th>
                    <th className="p-5 text-left text-white text-sm font-semibold">Category</th>
                    <th className="p-5 text-left text-white text-sm font-semibold">Availability</th>
                    <th className="p-5 text-left text-white text-sm font-semibold rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 border">
                  {currentItems.map((item) => (
                    <tr key={item.id} className="bg-white hover:bg-gray-50 transition-all">
                      <td className="p-5">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 object-cover"
                          onError={(e) => { e.target.src = "/fallback.png" }}
                        />
                      </td>
                      <td className="p-5 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {item.title}
                      </td>
                      <td className="p-5 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {item.price} Dh
                      </td>
                      <td className="p-5 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {item.categoryList.map((cat) => (
                          <span key={cat.id}>{cat.title}</span>
                        ))}
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={item.isAvailable}
                              onChange={() => handleAvailabilityToggle(item.id,item.title, item.isAvailable)}
                            />
                            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FD4C2A]/40 peer peer-checked:bg-[#FD4C2A] after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white"></div>
                            <span className="ms-3 text-sm font-medium text-gray-900">
                              {item.isAvailable ? "Enable" : "Disable"}
                            </span>
                          </label>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex gap-4">
                          <Link to={`/restaurant/edit/${item.id}`}>
                            <button className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                              <FaEdit /> Edit
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(item.id)}
                            className="text-red-500 hover:text-red-700 flex items-center gap-1"
                          >
                            <FaTrash /> Delete
                          </button>
                          <Link to={`/restaurant/itemDetail/${item.id}`}>
                            <button className="text-green-500 hover:text-green-700 flex items-center gap-1">
                              <FaInfoCircle /> Details
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentItems.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-5 text-center text-gray-500">
                        No food items found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-5">
              <ul className="flex gap-3">
                {pageNumbers.map((number) => (
                  <li key={number}>
                    <button
                      onClick={() => paginate(number)}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === number
                          ? 'bg-[#FD4C2A] text-white'
                          : 'bg-gray-200 text-gray-700'
                      } hover:bg-[#FD4C2A] hover:text-white`}
                    >
                      {number}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this item?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}