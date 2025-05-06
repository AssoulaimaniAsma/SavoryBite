import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { FaRegMoneyBill1 } from "react-icons/fa6";
import axios from "axios";

export default function IncomingNotifications() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [loadingStatus, setLoadingStatus] = useState({});
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 4;

  const fetchIncomingOrders = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("http://localhost:8080/restaurant/orders/incomingOrders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data)
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch incoming orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (orderId, actionType) => {
    setLoadingStatus(prev => ({ ...prev, [orderId]: true }));

    try {
      const token = localStorage.getItem("authToken");
      const url = `http://localhost:8080/restaurant/orders/incomingOrders/${orderId}/${actionType}`;

      await axios.put(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAlertMessage(`Order ${actionType === "accept" ? "accepted" : "rejected"} successfully!`);
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
        fetchIncomingOrders();
      }, 2000);

    } catch (error) {
      console.error(`Failed to ${actionType} order:`, error);
    } finally {
      setLoadingStatus(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const handleDismiss = (orderId) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  useEffect(() => {
    fetchIncomingOrders();
  }, []);

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(orders.length / ordersPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-6 relative">
      {showAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex items-center p-4 text-sm text-black rounded-lg bg-[#f0b9ae] shadow-lg">
            <span className="font-medium">{alertMessage}</span>
          </div>
        </div>
      )}

      <h1 className="text-2xl text-[#FD4C2A] font-bold mb-6">
        Incoming Order Notifications
      </h1>

      {orders.length === 0 ? (
        <div className="text-gray-500 text-sm text-center mt-20">No new notifications.</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-2xl overflow-hidden border border-[#FD4C2A]">
              <thead className="bg-[#FD4C2A] text-white text-left">
                <tr>
                  <th className="p-4">Order Number</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total Price</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="p-4 flex font-bold items-center gap-2">
                      <FaBell className="text-[#FD4C2A]" />
                      {order.id}
                    </td>
                    <td className="p-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="font-bold text-sm">
                          {item.food.title} x{item.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="p-4 font-bold flex items-center gap-2">
                      <FaRegMoneyBill1 className="text-[#FD4C2A]" />
                      {order.totalPrice}
                    </td>
                    <td className="p-4 text-center">
                      {loadingStatus[order.id] ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FD4C2A]"></div>
                          <span className="ml-2 text-gray-500 text-xs">Processing...</span>
                        </div>
                      ) : (
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleAction(order.id, "accept")}
                            className="px-3 py-1 text-sm text-white bg-green-500 hover:bg-green-600 rounded-full"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(order.id, "reject")}
                            className="px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded-full"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
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
        </>
      )}
    </div>
  );
}
