import React, { useContext } from "react";
import { CartContext } from "../CartContext/CartContext";

export default function Products({ products, updateQuantity, removeItem }) {
  const {addToCart} = useContext(CartContext);
  return (
<table className="w-[50%] rounded-[25px] overflow-hidden border-separate border-spacing-0 mr-[10px] shadow-lg">
  <thead>
    <tr className="bg-[#FD4C2A] text-white">
      <th className="p-4 text-[1.1rem] text-center">Product</th>
      <th className="p-4 text-[1.1rem] text-center">Price</th>
      <th className="p-4 text-[1.1rem] text-center">Quantity</th>
      <th className="p-4 text-[1.1rem] text-center">Total</th>
    </tr>
  </thead>
  <tbody className="[&_td]:p-8 [&_td]:text-center [&_td]:text-[1rem]">
    {products.map((item) => {
      if (!item || !item.food) return null;
      return (
        <tr key={item.itemID} className="border-b border-gray-200 hover:bg-gray-50">
          <td className="flex items-center gap-3 pl-4">
            {removeItem && (
              <button
                onClick={() => removeItem(item.itemID)}
                className="text-red-500 font-bold text-lg mr-2 hover:text-red-700"
              >
                X
              </button>
            )}
            <img
              src={item.food.image}
              alt={item.food.title}
              className="w-[50px] h-[50px] object-cover rounded-md"
            />
            <span className="text-left">{item.food.title}</span>
          </td>
          <td>{Number(item.food.discountedPrice).toFixed(2)} DH</td>
          <td>
            <div className="flex justify-center items-center">
              <button
                className="px-2 py-1  rounded-full  text-lg"
                onClick={() => updateQuantity(item.itemID, -1)}
              >
                -
              </button>
              <span className="mx-3">{item.quantity}</span>
              <button
                className="px-2 py-1  rounded-full  text-lg"
                onClick={() => updateQuantity(item.itemID, 1)}
              >
                +
              </button>
            </div>
          </td>
          <td>{(Number(item.food.discountedPrice) * item.quantity).toFixed(2)} DH</td>
        </tr>
      );
    })}
  </tbody>
</table>

  );
}