import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Modal from "react-modal";
import { AiOutlineClose } from "react-icons/ai";

function TabOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(4);

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
        <div className="mx-auto my-8 px-4 max-w-[1400px] w-full pl-[300px] pt-[30px] box-border">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4 w-full">
                <h1 className="text-[#FD4C2A] text-3xl font-bold pb-2.5 text-center w-full">Customer Orders</h1>
                <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="px-4 py-1.5 border-2 border-[#FD4C2A] rounded-full w-[300px] text-base transition-all focus:border-gray-500 focus:shadow-[0_0_5px_rgba(82,82,81,0.3)] focus:outline-none focus:w-[320px] mb-6"
                />
            </div>

            {loading && <div className="text-center py-8 text-xl">Loading...</div>}
            {error && <div className="text-center py-8 text-xl text-[#d32f2f]">{error}</div>}
            {orders.length === 0 && !loading && <div className="text-center py-8 text-xl text-gray-600">No orders found.</div>}

            <div className="overflow-x-auto mb-6 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-[#FD4C2A] text-white">
                            <th className="px-4 py-3 font-semibold text-center">Order ID</th>
                            <th className="px-4 py-3 font-semibold text-center">Client ID</th>
                            <th className="px-4 py-3 font-semibold text-center">Restaurant</th>
                            <th className="px-4 py-3 font-semibold text-center">Items</th>
                            <th className="px-4 py-3 font-semibold text-center">Total Price</th>
                            <th className="px-4 py-3 font-semibold text-center">Order Date</th>
                            <th className="px-4 py-3 font-semibold text-center">Status</th>
                            <th className="px-4 py-3 font-semibold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-100 even:bg-gray-50">
                                <td className="px-4 py-3 border-b border-gray-200 text-center">{order.id}</td>
                                <td className="px-4 py-3 border-b border-gray-200 text-center">{order.userId}</td>
                                <td className="px-4 py-3 border-b border-gray-200 text-center font-semibold">{order.restaurant.title}</td>
                                <td className="px-4 py-3 border-b border-gray-200 text-center">
                                    {order.items?.length > 0 ? (
                                        order.items.map(item => (
                                            <div key={item.id}>{item.food.title}</div>
                                        ))
                                    ) : "No items"}
                                </td>
                                <td className="px-4 py-3 border-b border-gray-200 text-center">
                                    {order.items?.length > 0 ? (
                                        order.items.reduce((total, item) => total + (item.priceAtOrderTime * item.quantity), 0).toFixed(2)
                                    ) : "0.00"}
                                </td>
                                <td className="px-4 py-3 border-b border-gray-200 text-center">{new Date(order.orderDate).toLocaleString()}</td>
                                <td className="px-4 py-3 border-b border-gray-200 text-center font-bold" style={{ color: getStatusColor(order.status) }}>
                                    {order.status}
                                </td>
                                <td className="px-4 py-3 border-b border-gray-200 text-center">
                                    <button 
                                        className="text-[#FD4C2A] underline px-2 py-0.5 text-sm transition-colors hover:text-[#c03c20] hover:no-underline"
                                        onClick={() => openModal(order)}
                                    >
                                        Details
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
                                className={`px-4 py-2 rounded transition-all ${currentPage === pageNum ? 'bg-[#FD4C2A] text-white' : 'border border-[#FD4C2A] bg-white text-[#FD4C2A] hover:bg-[#f8d7d0]'}`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                    
                    <button 
                        onClick={nextPage} 
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-[#FD4C2A] bg-white text-[#FD4C2A] rounded transition-all hover:bg-[#f8d7d0] disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-300"
                    >
                        Next
                    </button>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                ariaHideApp={false}
                contentLabel="Order Details"
                className="relative bg-white rounded-xl p-8 max-w-[90%] w-[800px] max-h-[90vh] overflow-y-auto shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]"
            >
                <div className="flex flex-col gap-6">
                    <button 
                        className="absolute top-4 right-4 text-[#FD4C2A] text-2xl transition-colors hover:text-[#c03c20]"
                        onClick={closeModal}
                    >
                        <AiOutlineClose />
                    </button>
                    <h2 className="text-2xl font-bold">Order Details</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div><strong>Order ID:</strong> {selectedOrder?.id}</div>
                        <div><strong>Client ID:</strong> {selectedOrder?.userId}</div>
                        <div><strong>Restaurant:</strong> {selectedOrder?.restaurant?.title}</div>
                        <div>
                            <strong>Status:</strong> 
                            <span style={{ color: getStatusColor(selectedOrder?.status) }}>
                                {selectedOrder?.status}
                            </span>
                        </div>
                        <div>
                            <strong>Total Price:</strong> 
                            {selectedOrder?.items?.reduce((total, item) => 
                                total + (item.priceAtOrderTime * item.quantity), 0).toFixed(2)} DH
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full mt-4">
                            <thead>
                                <tr className="bg-[#FD4C2A] text-white">
                                    <th className="px-3 py-2 text-left">Item</th>
                                    <th className="px-3 py-2 text-left">Image</th>
                                    <th className="px-3 py-2 text-left">Price</th>
                                    <th className="px-3 py-2 text-left">Qty</th>
                                    <th className="px-3 py-2 text-left">Total</th>
                                    <th className="px-3 py-2 text-left">Categories</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedOrder?.items?.map((item) => (
                                    <tr key={item.id} className="even:bg-gray-50">
                                        <td className="px-3 py-2 border-b border-gray-200">{item.food.title}</td>
                                        <td className="px-3 py-2 border-b border-gray-200">
                                            <img 
                                                src={item.food.image} 
                                                alt={item.food.title} 
                                                className="w-[60px] h-[60px] object-cover rounded" 
                                            />
                                        </td>
                                        <td className="px-3 py-2 border-b border-gray-200">{item.priceAtOrderTime} DH</td>
                                        <td className="px-3 py-2 border-b border-gray-200">{item.quantity}</td>
                                        <td className="px-3 py-2 border-b border-gray-200">{(item.priceAtOrderTime * item.quantity).toFixed(2)} DH</td>
                                        <td className="px-3 py-2 border-b border-gray-200">
                                            {item.categoryTitles?.join(", ") || "No categories"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg mt-4">
                        <h3 className="text-xl text-[#FD4C2A] mt-0">Delivery Information</h3>
                        {selectedOrder?.items?.[0]?.deliveryAddress ? (
                            <div className="space-y-2">
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