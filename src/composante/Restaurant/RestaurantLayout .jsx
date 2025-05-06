// layouts/RestaurantLayout.jsx
import Navbar_Restaurant from "./Navbar_Restaurant/Navbar_Restaurant";
import React from "react";

const RestaurantLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar fixe à gauche */}
      <aside className="w-64 h-screen fixed bg-white shadow-lg z-20">
        <Navbar_Restaurant />
      </aside>

      {/* Contenu principal avec marge à gauche */}
      <main className="ml-64 w-full bg-gray-100 p-6">
        {children}
      </main>
    </div>
  );
};

export default RestaurantLayout;
