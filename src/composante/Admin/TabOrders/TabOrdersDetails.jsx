import React, {useState,useEffect} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import "./TabOrdersDetails.css";

function TabOrdersDetails() {
    const { id } = useParams();  // Récupération de l'ID de la commande depuis l'URL
    const [order, setOrder] = useState(null);
  
    useEffect(() => {
        console.log("ID de la commande:", id);
      // Effectuer une requête GET pour récupérer la commande par ID
      axios
        .get(`http://localhost:3007/orders/${id}`)  // Utilisation de l'ID dans l'URL
        .then((response) => {
          setOrder(response.data);  // Met à jour l'état avec la commande
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération de la commande:", error);
        });
    }, [id]);
  
    return (
      <div className="divContentOrderDetails">
        <h2 className="OrderDetails">Order Details</h2>
        {order ? (
          <div>
            <table className="TableOrdersDetails">
              <thead>
                <tr className="trOrdersDetails">
                  <th>Order ID</th>
                  <th>Client Name</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="tdOrdersDetails">{order.id}</td>
                  <td className="tdOrdersDetails">{order.clientName}</td>
                  <td className="tdOrdersDetails">
                    {/* Affichage des items sous forme de liste simple */}
                    {order.items.map((item) => (
                      <div className="tdOrdersDetails" key={item.idItem}>
                        <p><strong>{item.name}</strong> - {item.category}</p>
                        <p >{item.description}</p>
                        <p >{item.price} DH</p>
                      </div>
                    ))}
                  </td>
                  <td className="tdOrdersDetails">{order.status}</td>
                  <td className="tdOrdersDetails">{order.date}</td>
                  <td className="tdOrdersDetails">{order.total} DH</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p>Loading order details...</p>
        )}
      </div>
    );
  }
  
  export default TabOrdersDetails;
  