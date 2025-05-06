import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

const popularFilters = [
  { name: "Burgers", icon: "🍔" },
  { name: "Pizza", icon: "🍕" },
  { name: "Sandwichs", icon: "🥪" },
  { name: "Pâtes", icon: "🍝" },
  { name: "Plats marocains", icon:  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Flag_of_Morocco.svg" alt="Maroc" className="w-6 h-6" /> }
];

const moreFilters = ["Américain", "Asiatique", "Boulangerie et pâtisserie", "Chawarma"];

export default function Sidebar() {
  const [activeFilter, setActiveFilter] = useState("Burgers");
  const [openMoreFilters, setOpenMoreFilters] = useState(false);

  return (
    <div className="mt-1 w-64 p-4 border-r bg-white min-h-screen">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Filtres populaires</h2>
      <ul className="space-y-2">
        {popularFilters.map((filter, index) => (
          <li key={index}>
            <button
              className={`w-full flex items-center gap-3 p-2 rounded-lg ${
                activeFilter === filter.name ? "bg-yellow-100 text-yellow-700 font-semibold" : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveFilter(filter.name)}
            >
              <span className="text-xl">{filter.icon}</span> {filter.name}
            </button>
          </li>
        ))}
      </ul>
      
      <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Plus de filtres</h2>
      <button
        className="w-full flex justify-between items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        onClick={() => setOpenMoreFilters(!openMoreFilters)}
      >
        Plus de filtres
        {openMoreFilters ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>
      {openMoreFilters && (
        <ul className="mt-2 space-y-2 pl-4 text-gray-700 text-sm">
          {moreFilters.map((filter, index) => (
            <li key={index}>{filter}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
