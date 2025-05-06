

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Utensils } from 'lucide-react';

export default function EditFood() {
  const { foodId } = useParams();
  const navigate = useNavigate();
  const [foodItem, setFoodItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    price: '',
    discount: 0,
    category: [],
    isAvailable: true,
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

   const [categories, setCategories] = useState([]);
 
   useEffect(() => {
     fetch("http://localhost:8080/public/allCategories")
       .then((res) => res.json())
       .then((data) => {
         const filteredAndSorted = data
           .filter((cat) => cat.title.toLowerCase() !== 'all') // ❌ exclure 'All'
           .map((cat) => ({
             id: cat.id,
             name: cat.title,
             icon: cat.categoryIcon,
           }))
           .sort((a, b) => a.name.localeCompare(b.name)); // ✅ trier alphabétiquement
         setCategories(filteredAndSorted);
       })
       .catch((err) => console.error("Erreur de récupération :", err));
   }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/restaurant/SigninRestaurant");
      return;
    }

    fetch(`http://localhost:8080/restaurant/foodItem/${foodId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement du plat.");
        return res.json();
      })
      .then((data) => {
        setFoodItem(data);
        const categoryIds = data.categoryList ? data.categoryList.map(cat => cat.id) : [];
        setFormData({
          title: data.title || '',
          description: data.description || '',
          image: null,
          price: data.price || '',
          discount: data.discount ?? 0,
          category: categoryIds,
          isAvailable: data.isAvailable ?? true,
        });
        setImagePreviewUrl(data.image || null);
      })
      .catch((err) => {
        console.error(err);
        setAlertMessage("Error loading data.");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      });
  }, [foodId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e) => {
    const selectedCategories = Array.from(e.target.selectedOptions).map(
      (option) => parseInt(option.value)
    );
    setFormData((prev) => ({ ...prev, category: selectedCategories }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    const categoriesToSend = formData.category.length > 0 ? formData.category : (foodItem && foodItem.categoryList) ? foodItem.categoryList.map(cat => cat.id) : [];

    const updatedItem = {
      title: formData.title,
      description: formData.description,
      image: formData.image ? `/image/${formData.image.name}` : foodItem?.image,
      price: parseFloat(formData.price),
      discount: parseInt(formData.discount),
      categoriesID: categoriesToSend,
      isAvailable: formData.isAvailable,
    };

    try {
      const res = await fetch(
        `http://localhost:8080/restaurant/foodItem/${foodId}/update`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedItem),
        }
      );

      if (res.ok) {
        setAlertMessage("Food item updated successfully!");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        navigate("/restaurant");
      } else {
        const errText = await res.text();
        setAlertMessage("Erreur : " + errText);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (error) {
      console.error("Update failed:", error);
      setAlertMessage("Update failed.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  return (
    <div className="mt-8 max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {showAlert && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2 text-white bg-green-500 rounded shadow">
          {alertMessage}
        </div>
      )}

<h2 className="text-3xl font-bold text-[#FD4C2A] mb-4">Edit Food</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        <div>
        <div className="flex items-center gap-4">
  {imagePreviewUrl ? (
    <img
      src={imagePreviewUrl}
      alt="Preview"
      className="w-[140px] h-[140px] object-cover "
    />
  ) : (
    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
      <Utensils className="w-10 h-10 text-gray-500" />
    </div>
  )}

  {/* Hidden file input */}
  <input
    id="file-upload"
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    className="hidden"
  />

  {/* Styled label acting as the button */}
  <label
    htmlFor="file-upload"
    className="cursor-pointer bg-[#FD4C2A] text-white text-xm font-semibold px-3 py-2 rounded-full dark:bg-blue-900 dark:text-blue-300"
  >
    Choose File
  </label>
</div>

        </div>

        <input
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Title"
          className="p-2 border rounded"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Description"
          className="p-2 border rounded"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Price"
            className="p-2 border rounded"
          />
          <input
            name="discount"
            type="number"
            value={formData.discount}
            onChange={handleInputChange}
            placeholder="Discount"
            className="p-2 border rounded"
          />
        </div>

        <div className="flex items-center gap-3">
  <label className="text-gray-700">Available:</label>
  <label className="inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only peer"
      checked={formData.isAvailable}
      onChange={() =>
        setFormData((prev) => ({
          ...prev,
          isAvailable: !prev.isAvailable,
        }))
      }
    />
    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FD4C2A]/40 peer peer-checked:bg-[#FD4C2A] after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white"></div>
    <span className="ms-3 text-sm font-medium text-gray-900">
      {formData.isAvailable ? "Enable" : "Disable"}
    </span>
  </label>
</div>


        <select
          name="category"
          multiple
          value={formData.category}
          onChange={handleCategoryChange}
          className="p-2 border rounded"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="px-6 py-3 bg-[#FD4C2A] text-white rounded-lg hover:bg-[#fd3f1e]"
        >
          Update Food
        </button>
      </form>
    </div>
  );
}
