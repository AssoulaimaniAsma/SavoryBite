import React, { useEffect, useState } from "react";
import "./History.css";
import { Link, useParams } from "react-router-dom";

const ItmesPage = (orderID) => {
  alert("f");
};
const handleReorder = (orderID) => {
  alert("g");
};
function History() {
  const [orders, setOrders] = useState([]);
  let params = useParams();
  const userId = params.userId;
  useEffect(() => {
    console.log("🚀 ~ History ~ userId:", userId); 
    const orders = [
      {
        orderNum: "2133",
        items: "Order 2133",
        status: "Delivered",
        TrackingID: "orderID1",
        DeliveryDate: "23-7-2025",
        Price: "143DH",
      },
      {
        orderNum: "2133",
        items: "Order 2133",
        status: "Delivered",
        TrackingID: "orderID2",
        DeliveryDate: "23-7-2025",
        Price: "143DH",
      },
      {
        orderNum: "2133",
        items: "Order 2133",
        status: "Delivered",
        TrackingID: "orderID3",
        DeliveryDate: "23-7-2025",
        Price: "143DH",
      },
    ];
    setOrders(orders);
  }, []);

  return (
    <div id="OrderPageContent">
      <h2 id="h2content6">Order History</h2>
      <table id="OrderTable">
        <thead id="HeaderOrderContent">
          <tr>
            <th>Order no</th>
            <th>Items</th>
            <th>Status</th>
            <th>Tracking ID</th>
            <th>Delivery Date</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr id="trOrderContent" key={order.TrackingID}>
              <td className="tdOrderContent">{order.orderNum}</td>
              <td className="tdOrderContent underline">
                <Link to={"/orders/" + order.TrackingID}>{order.items}</Link>
              </td>
              <td className="tdOrderContent">{order.status}</td>
              <td className="tdOrderContent">{order.TrackingID}</td>
              <td className="tdOrderContent">{order.DeliveryDate}</td>
              <td className="tdOrderContent">{order.Price}</td>
              <td className="tdOrderContent">
                <button onClick={() => handleReorder(order.TrackingID)}>
                  Re-Order
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default History;
