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
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(8);

    const filteredOrders = orders.filter((order) =>
        (order.id.toString().includes(searchQuery.toLowerCase())) ||
        (order.userId.toString().includes(searchQuery.toLowerCase())) ||
        (order.restaurant.title ? order.restaurant.title.toLowerCase() : "")
            .includes(searchQuery.toLowerCase()) ||
        (order.status ? order.status.toLowerCase() : "")
            .includes(searchQuery.toLowerCase())
    );

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    const getStatusColor = (status) => {
        switch (status) {
            case 'UNCOMPLETED': return 'gray';
            case 'COMPLETED': return 'green';
            case 'ACCEPTED': return 'blue';
            case 'PREPARING': return 'orange';
            case 'OUT_FOR_DELIVERY': return 'yellow';
            case 'DELIVERED': return 'lightgreen';
            case 'CANCELLED': return 'red';
            case 'REJECTED': return 'darkred';
            default: return 'black';
        }
    };

    useEffect(() => {
        Modal.setAppElement('#root');
    }, []);

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
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to fetch data");

            const data = await res.json();
            setOrders(data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
        } catch (err) {
            setError("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const openModal = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        setCurrentPage(1);
    }, [orders]);

    useEffect(() => {
        fetchOrders();
        const intervalId = setInterval(() => {
            console.log("auto refreshing");
            fetchOrders();
        }, 30000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="orders-container">
            <div className="orders-header">
                <h1 className="orders-title">Customer Orders</h1>
                <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="search-input"
                />
            </div>

            {loading && <div className="loading">Loading...</div>}
            {error && <div className="error">{error}</div>}
            {orders.length === 0 && !loading && <div className="no-orders">No orders found.</div>}

            <div className="table-responsive">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Client ID</th>
                            <th>Restaurant</th>
                            <th>Items</th>
                            <th>Total Price</th>
                            <th>Order Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOrders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.userId}</td>
                                <td>{order.restaurant.title}</td>
                                <td>
                                    {order.items?.length > 0 ? (
                                        order.items.map(item => (
                                            <div key={item.id}>{item.food.title}</div>
                                        ))
                                    ) : "No items"}
                                </td>
                                <td>
                                    {order.items?.length > 0 ? (
                                        order.items.reduce((total, item) => total + (item.priceAtOrderTime * item.quantity), 0).toFixed(2)
                                    ) : "0.00"}
                                </td>
                                <td>{new Date(order.orderDate).toLocaleString()}</td>
                                <td style={{ color: getStatusColor(order.status), fontWeight: 'bold' }}>
                                    {order.status}
                                </td>
                                <td>
                                    <button className="details-btn" onClick={() => openModal(order)}>
                                        Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={prevPage} disabled={currentPage === 1}>
                        Previous
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                        let pageNum;
                        if (totalPages <= 5) {
                            pageNum = index + 1;
                        } else if (currentPage <= 3) {
                            pageNum = index + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + index;
                        } else {
                            pageNum = currentPage - 2 + index;
                        }
                        
                        return (
                            <button
                                key={pageNum}
                                onClick={() => paginate(pageNum)}
                                className={currentPage === pageNum ? "active" : ""}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                    
                    <button onClick={nextPage} disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                ariaHideApp={false}
                contentLabel="Order Details"
                className="order-modal"
                overlayClassName="modal-overlay"
            >
                <div className="modal-content">
                    <button className="close-btn" onClick={closeModal}>
                        <AiOutlineClose />
                    </button>
                    <h2>Order Details</h2>
                    
                    <div className="order-summary">
                        <div><strong>Order ID:</strong> {selectedOrder?.id}</div>
                        <div><strong>Client ID:</strong> {selectedOrder?.userId}</div>
                        <div><strong>Restaurant:</strong> {selectedOrder?.restaurant?.title}</div>
                        <div><strong>Status:</strong> <span style={{ color: getStatusColor(selectedOrder?.status) }}>
                            {selectedOrder?.status}
                        </span></div>
                        <div><strong>Total Price:</strong> {selectedOrder?.items?.reduce((total, item) => 
                            total + (item.priceAtOrderTime * item.quantity), 0).toFixed(2)} DH
                        </div>
                    </div>

                    <div className="items-table-container">
                        <table className="items-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Image</th>
                                    <th>Price</th>
                                    <th>Qty</th>
                                    <th>Total</th>
                                    <th>Categories</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedOrder?.items?.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.food.title}</td>
                                        <td>
                                            <img 
                                                src={item.food.image} 
                                                alt={item.food.title} 
                                                className="item-image" 
                                            />
                                        </td>
                                        <td>{item.priceAtOrderTime} DH</td>
                                        <td>{item.quantity}</td>
                                        <td>{(item.priceAtOrderTime * item.quantity).toFixed(2)} DH</td>
                                        <td>
                                            {item.categoryTitles?.join(", ") || "No categories"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="delivery-info">
                        <h3>Delivery Information</h3>
                        {selectedOrder?.items?.[0]?.deliveryAddress ? (
                            <div>
                                <div><strong>Region:</strong> {selectedOrder.items[0].deliveryAddress.region}</div>
                                <div><strong>Province:</strong> {selectedOrder.items[0].deliveryAddress.province}</div>
                                <div><strong>Commune:</strong> {selectedOrder.items[0].deliveryAddress.commune}</div>
                            </div>
                        ) : (
                            <div>No delivery address available</div>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default TabOrders;