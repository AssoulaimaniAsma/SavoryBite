import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Modal from "react-modal";
import { AiOutlineClose } from "react-icons/ai";
import "./TabOrders.css";


function TabOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchQuery, setSearchQuery]=useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(5);

      // Filter orders based on the search query, with safeguards for undefined values
  const filteredOrders = orders.filter((order) =>
    (order.id.toString().includes(searchQuery.toLowerCase())) ||
  (order.userId.toString().includes(searchQuery.toLowerCase())) ||
    (order.restaurant.title ? order.restaurant.title.toLowerCase() : "")
    .includes(searchQuery.toLowerCase()) ||
    (order.status ? order.status.toLowerCase() : "")
    .includes(searchQuery.toLowerCase()) 
);

    // Calculez les index pour la pagination
const indexOfLastOrder = currentPage * ordersPerPage;
const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

// Obtenez les commandes pour la page actuelle (en combinant avec le filtre de recherche)
const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

// Fonction pour changer de page
const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getStatusColor = (status) => {
        switch (status) {
          case 'UNCOMPLETED':
            return 'gray';
          case 'COMPLETED':
            return 'green';
          case 'ACCEPTED':
            return 'blue';
          case 'PREPARING':
            return 'orange';
          case 'OUT_FOR_DELIVERY':
            return 'yellow';
          case 'DELIVERED':
            return 'lightgreen';
          case 'CANCELLED':
            return 'red';
          case 'REJECTED':
            return 'darkred';
          default:
            return 'black'; // Default color if status is unknown
        }
      };
      
    useEffect(() => {
        Modal.setAppElement('#root'); // Set the app element for accessibility
      }, []);

      // Handle search input change
    const handleSearch = (e) => {
      setSearchQuery(e.target.value);
      setCurrentPage(1);
  };

  

  const fetchOrders = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return navigate("/client/login");

    try {
      const res = await fetch("http://localhost:8080/admin/orders/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await res.json();
      setOrders(data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (order) => {
  console.log("Opening modal for order:", order); // Check if this is logged when clicking
  setSelectedOrder(order);
  setIsModalOpen(true);
};

const closeModal = () => {
  console.log("Closing modal");
  setIsModalOpen(false);
  setSelectedOrder(null);
};

const nextPage = () => {
  if (currentPage < Math.ceil(filteredOrders.length / ordersPerPage)) {
    setCurrentPage(currentPage + 1);
  }
};

const prevPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};


useEffect(() => {
  setCurrentPage(1);
}, [orders]);

  useEffect(() => {
    fetchOrders();
    const intercalId=setInterval(()=>{
      console.log("auto refreching");
      fetchOrders();
    },30000);
    return()=> clearInterval(intercalId);
  }, []);

  return (
    <div className="divContentOrder">
      <h1 className="CustomerOrder">Customer Orders</h1>
      <input 
          type="text" 
          placeholder="Search For Order" 
          value={searchQuery}
          onChange={handleSearch} 
          className="searchBarOrder"
      />
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {orders.length === 0 && !loading && <div>No orders found.</div>}

      <table className="TableOrders">
        <thead className="thOrders">
          <tr>
            <th>Order ID</th>
            <th>Client ID</th>
            <th>Restaurant</th>
            <th>Items</th>
            <th>Total Price</th>
            <th>Order Date</th>
            <th>Payment Date</th>
            <th>Is Paid</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        {currentOrders.map((order) => (
  <tr className="trOrders" key={order.id}>
    <td>{order.id}</td>
    <td>{order.userId}</td>
    <td>{order.restaurant.title}</td>
    <td>
      {order.items && order.items.length > 0 ? (
        order.items.map(item => (
          <div key={item.id}>
            <p>{item.food.title}</p>
          </div>
        ))
      ) : (
        <p>No items</p>
      )}
    </td>
    <td>
        {order.items && order.items.length > 0 ? (
            order.items.reduce((total, item) => total + (item.priceAtOrderTime * item.quantity), 0).toFixed(2)
        ) : (
            <p>No items</p>
        )}
        </td>
    <td>{new Date(order.orderDate).toLocaleString()}</td>
    <td>{order.paymentDate ? new Date(order.paymentDate).toLocaleString() : "Not available"}</td>
    <td>{order.paid ? "Yes" : "No"}</td>
    <td style={{ fontWeight:'bold' , color: getStatusColor(order.status) }}>
        {order.status}
    </td>

    <td>
      <button className="details" onClick={() => openModal(order)}>
        More Details
      </button>
    </td>
  </tr>
))}

        </tbody>
      </table>
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>
          &laquo; Précédent
        </button>

        {Array.from({ length: Math.ceil(filteredOrders.length / ordersPerPage) })
          .slice(
            Math.max(0, currentPage - 3),
            Math.min(Math.ceil(filteredOrders.length / ordersPerPage), currentPage + 2)
          )
          .map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
        ))}
      </div> 
      {selectedOrder && (
          <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          ariaHideApp={false}
        contentLabel="Order Details"
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
        <div className="OrderDetails">
        <button className="Close" onClick={closeModal}><AiOutlineClose/></button>
        <br/><br/>
          <h2 className="CustomerOrderDetails" >Order Details</h2>
          <table className="TableOrderDetails">
            <thead className="thOrders">
              <tr>
                <th>Item Image</th>
                <th>Item</th>
                <th>Price At Order Time</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Category</th>
                <th>Delivery Address</th>
              </tr>
            </thead>
            <tbody>
        {selectedOrder.items && selectedOrder.items.length > 0 ? (
          selectedOrder.items.map((item) => (
            <tr className="trOrderDetails" key={item.id}>
              <td>
                <img src={item.food.image} alt={item.food.title} className="imageOrderDetails"  />
              </td>
              <td>{item.food.title}</td>
              <td>{item.priceAtOrderTime}</td>
              <td>{item.quantity}</td>
              <td>{item.priceAtOrderTime*item.quantity}DH</td>
              <td>{item.categoryTitles && Array.isArray(item.categoryTitles) ? item.categoryTitles.join(", ") : "No categories"}</td>
              <td>
                {item.deliveryAddress ? 
                    `${item.deliveryAddress.region}/ ${item.deliveryAddress.province}/ ${item.deliveryAddress.commune}` 
                    : "No address available"}
              </td> 
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5">No items</td>
          </tr>
        )}
      </tbody>
          </table>
          
      </div>
        </Modal>
      )}
    </div>
  );
}

export default TabOrders;
