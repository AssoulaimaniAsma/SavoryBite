import React, { useContext } from "react";
import { CartContext } from "../CartContext/CartContext";

export default function Products({ products, updateQuantity, removeItem }) {
  const {addToCart} = useContext(CartContext);
  return (
    <table className="Product">
      <thead>
        <tr className="headTable">
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody className="bodyTab2">
        {products.map((item) => {
          if(!item || !item.food) return null;
          return(
          <tr key={item.itemID}>
            <td className="picProd">
            {removeItem && (
                <button onClick={() => removeItem(item.itemID)} className="removeBtn">X</button>
            )}
              <img src={item.food.image} alt={item.food.title} width="50" height="50" />
              <span>{item.food.title}</span>
            </td>
            <td>{Number(item.food.discountedPrice).toFixed(2)}DH</td>
            <td className="quantityContent">
              <button
                className="DecQuantity"
                onClick={() => updateQuantity(item.itemID, -1)}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                className="IncQuantity"
                onClick={() => updateQuantity(item.itemID, 1)}
              >
                +
              </button>
            </td>
            <td>{(Number(item.food.discountedPrice) * item.quantity).toFixed(2)} DH</td>
          </tr>
          );
})}
      </tbody>
    </table>
  );
}