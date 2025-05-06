import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import "./account_setting.css";
import { FaEdit } from "react-icons/fa";

const AccountSettings = () => {
  const [formData, setFormData] = useState({
    title: "",
    phone: "",
    email: "",
    contactEmail: "",
    paypalEmail: "",
    oldPassword: "",
    newPassword: "",
  });

  const [showCoordinates, setShowCoordinates] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [profileBanner, setProfileBanner] = useState(null);
const [profileBannerUrl, setProfileBannerUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [communes, setCommunes] = useState([]);
  const token = localStorage.getItem("authToken");
  const [address, setAddress] = useState({
    title: "",
    street: "",
    commune: null,
    province: null,
    region: null,
    isDefault: false,
    id: null,
  });

  const [formDataa, setFormDataa] = useState({
    title: "",
    street: "",
    region: "",
    province: "",
    commune: "",
    isDefault: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await axios.get("http://localhost:8080/restaurant/address/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddress(res.data);
        setFormDataa({
          title: res.data.title || "",
          street: res.data.street || "",
          region: res.data.region?.id || "",
          province: res.data.province?.id || "",
          commune: res.data.commune?.id || "",
          isDefault: res.data.isDefault || false,
        });
      } catch (err) {
        console.error("Error fetching address", err);
      }
    };

    if (token) {
      fetchAddress();
    }
  }, [token]);

  // Load regions on mount
  useEffect(() => {
    axios
      .get("http://localhost:8080/public/addressDetails/Regions")
      .then((res) => setRegions(res.data))
      .catch((err) => console.error("Error fetching regions", err));
  }, []);

  const handleChange2 = (field, value) => {
    setFormDataa((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "region") {
      axios
        .get(`http://localhost:8080/public/addressDetails/Provinces?regionID=${value}`)
        .then((res) => setProvinces([...res.data])) // Créer une nouvelle référence de tableau
        .catch((err) => console.error("Error fetching provinces", err));
      setFormDataa((prev) => ({ ...prev, province: "", commune: "" }));
      setProvinces([]);
      setCommunes([]);
    }

    if (field === "province") {
      axios
        .get(`http://localhost:8080/public/addressDetails/Communes?provinceID=${value}`)
        .then((res) => setCommunes([...res.data])) // Créer une nouvelle référence de tableau
        .catch((err) => console.error("Error fetching communes", err));
      setFormDataa((prev) => ({ ...prev, commune: "" }));
      setCommunes([]);
    }
  };

  useEffect(() => {
    if (!token) return navigate("/restaurant/SigninRestaurant");

    const fetchAccountDetails = async () => {
      try {
        const res = await fetch("http://localhost:8080/restaurant/accountDetails", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch");

        const user = await res.json();

        setFormData({
          title: user.title || "",
          contactEmail: user.contactEmail || "",
          paypalEmail: user.paypalEmail || "",
          email: user.email || "",
          phone: user.phone || "",
          oldPassword: "",
          newPassword: "",
        });

        setProfileImageUrl(user.profileImg || "");
setProfileBannerUrl(user.profileBanner || "");

      } catch (err) {
        console.error("Erreur récupération compte:", err);
      }
    };

    fetchAccountDetails();
  }, [navigate, token]);

  const userInitials = (formData.title[0] || "").toUpperCase();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);

    if (file) {
      const imagePath = `/image/${file.name}`;
      setProfileImageUrl(imagePath);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|hotmail|outlook|live|protonmail|icloud|aol|zoho|mail|yandex|gmx|fastmail)\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Adresse email invalide.";
    }
    if (!emailRegex.test(formData.contactEmail)) {
      newErrors.contactEmail = "Adresse email invalide.";
    }
    if (!emailRegex.test(formData.paypalEmail)) {
      newErrors.paypalEmail = "Adresse email invalide.";
    }
    if (!/^(?:\+2126|06)\d{8}$/.test(formData.phone)) {
      newErrors.phone = "Numéro invalide. Format : +2126xxxxxxxx ou 06xxxxxxxx";
    }
    if (
      formData.newPassword &&
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.newPassword)
    ) {
      newErrors.newPassword =
        "Le mot de passe doit contenir 8 caractères, une majuscule, une minuscule et un chiffre.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) return;

    if (!token) return navigate("/restaurant/SigninRestaurant");

    const formDataToSend = {
      title: formData.title,
      paypalEmail: formData.paypalEmail,
      contactEmail: formData.contactEmail,
      email: formData.email,
      phone: formData.phone,
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    };

    if (profileImageUrl) {
      formDataToSend.profileImg = profileImageUrl;
    }
    if (profileBannerUrl) {
      formDataToSend.profileBanner = profileBannerUrl;
    }
    try {
      const res = await fetch("http://localhost:8080/restaurant/updateAccountDetails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { message: text };
      }

      if (!res.ok) {
        setErrors({ general: data.message || "Une erreur est survenue." });
        return;
      }

      setSuccessMessage(data.message || "Mise à jour réussie !");
      setShowAlert(true);
      setIsEditable(false);

      setTimeout(() => {
        setShowAlert(false);
        setSuccessMessage("");
      }, 3000);

      setFormData((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
      }));
    } catch (err) {
      console.error("Erreur mise à jour compte:", err);
      setErrors({ general: "Erreur de connexion au serveur." });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleChangee = (e) => {
    const { name, value, type, checked } = e.target;
    setFormDataa({
      ...formDataa,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCheckboxChange = () => {
    const newValue = !showCoordinates;
    setShowCoordinates(newValue);
    setLatitude("");
    setLongitude("");
    if (newValue) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Location permission denied:", error.message);
          setShowCoordinates(false);
        }
      );
    }
  };

  const handleSave = () => {
    const payload = {
      id: address.id,
      title: formDataa.title,
      street: formDataa.street,
      regionID: formDataa.region,
      provinceID: formDataa.province,
      communeID: formDataa.commune,
      isDefault: formDataa.isDefault,
      latitude: latitude,
      longitude: longitude,
    };

    axios
      .post("http://localhost:8080/restaurant/address/update", payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("✅ Address updated!");
        setIsEditing(false);
        // Refetch address data
        axios
          .get("http://localhost:8080/restaurant/address/", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => setAddress(res.data))
          .catch((err) => console.error("Error refetching address", err));
      })
      .catch((err) => {
        console.error("Error updating address", err);
        alert("❌ Failed to update address");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };

  const handleEditAddressClick = async () => {
    setIsEditing(true);
    setFormDataa({
      title: address.title || "",
      street: address.street || "",
      region: address.region?.id || "",
      province: address.province?.id || "",
      commune: address.commune?.id || "",
      isDefault: address.isDefault || false,
    });

    // Charger les provinces si une région existe
    if (address.region?.id) {
      try {
        const resProvinces = await axios.get(
          `http://localhost:8080/public/addressDetails/Provinces?regionID=${address.region.id}`
        );
        setProvinces(resProvinces.data);
      } catch (err) {
        console.error("Error fetching provinces", err);
      }

      // Charger les communes si une province existe
      if (address.province?.id) {
        try {
          const resCommunes = await axios.get(
            `http://localhost:8080/public/addressDetails/Communes?provinceID=${address.province.id}`
          );
          setCommunes(resCommunes.data);
        } catch (err) {
          console.error("Error fetching communes", err);
        }
      }
    }
  };

  return (
    <div className="mt-8 max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800">Account Settings</h2>
      <p className="text-gray-500 text-sm mb-6">
        Manage your profile and update your personal information.
      </p>

      {showAlert && (
        <div className="mb-4">
          <div className="flex items-center p-4 text-sm text-black rounded-lg bg-[#f0b9ae]">
            <svg className="shrink-0 inline w-4 h-4 me-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Z" />
              <path d="M9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <div><span className="font-medium">{successMessage}</span></div>
          </div>
        </div>
      )}

<div className="relative w-full h-60 mb-28">
  {/* Image de couverture */}
  <img
  src={profileBannerUrl || "/image/signinRes.jpg"}
  alt="cover"
  className="absolute top-0 left-0 w-full h-60 object-cover z-0 rounded-lg"
/>



  {/* Container pour centrage */}
  <div className="w-full max-w-7xl mx-auto px-6 md:px-8 relative">
    {/* Bloc profil, positionné en bas de l'image de couverture */}
    <div className="absolute -bottom-80 left-1/2 transform -translate-x-1/2 sm:left-8 sm:translate-x-0 flex items-center space-x-4 z-10">
      {profileImageUrl ? (
        <img
          src={profileImageUrl}
          alt="Profile"
          className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold border-4 border-white shadow-lg">
          {userInitials}
        </div>
      )}

      {/* Nom + email */}
      <div>
        <h3 className="mt-20 text-3xl font-semibold text-[#FD4C2A]">{formData.title}</h3>
        <p className="text-gray-500">{formData.email}</p>
      </div>
    </div>
  </div>
</div>



      <div className="EditDiv mt-4 flex justify-between items-center">
      {isEditable && (
  <label className="EditProfile cursor-pointer">
    Change Banner Picture
    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files[0];
        setProfileBanner(file);
        if (file) {
          const bannerPath = `/image/${file.name}`;
          setProfileBannerUrl(bannerPath);
        }
      }}
    />
  </label>
)}

        {isEditable && (
          <label className="EditProfile cursor-pointer">
            Change Profile Picture
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        )}

        {!isEditable && (
          <button className="EditButton" onClick={handleEditClick}>
            Edit
          </button>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {["title", "contactEmail", "paypalEmail", "email", "phone"].map((field) => (
          <div key={field}>
            <label className="text-gray-600 capitalize font-bold">{field}</label>
            <input
              type={field.includes("email") ? "email" : "text"}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              readOnly={!isEditable}
            />
            {errors[field] && (
              <p className="text-red-500 text-sm">{errors[field]}</p>
            )}
          </div>
        ))}
      </div>

      {isEditable && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label className="text-gray-600 font-bold">Old Password</label>
            <input
              type={showOldPassword ? "text" : "password"}
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg pr-10"
            />
            <span
              className="absolute top-9 right-4 text-gray-500 cursor-pointer"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="relative">
            <label className="text-gray-600 font-bold">New Password</label>
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg pr-10"
            />
            <span
              className="absolute top-9 right-4 text-gray-500 cursor-pointer"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.newPassword && (<p className="text-red-500 text-sm">{errors.newPassword}</p>
            )}
          </div>
        </div>
      )}

      <div className="Address mt-6">
        <span className="text-gray-600 font-bold">Address</span>

        <div className="w-full my-4 p-4 border rounded-xl shadow-sm relative bg-white">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                  name="title"
                  value={formDataa.title}
                  onChange={handleChangee}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Region</label>
                <select
                  name="region"
                  value={formDataa.region}
                  onChange={(e) => handleChange2(e.target.name, e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select region</option>
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>{r.regionName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Province</label>
                <select
                  name="province"
                  value={formDataa.province}
                  onChange={(e) => handleChange2(e.target.name, e.target.value)}

                  className="w-full p-2 border rounded"
                  disabled={!formDataa.region}
                >
                  <option value="">Select province</option>
                  {provinces.map((p) => (
                    <option key={p.id} value={p.id}>{p.provinceName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Commune</label>
                <select
                  name="commune"
                  value={formDataa.commune}
                  onChange={(e) => handleChange2(e.target.name, e.target.value)}
                  className="w-full p-2 border rounded"
                  disabled={!formDataa.province}
                >
                  <option value="">Select commune</option>
                  {communes.map((c) => (
                    <option key={c.id} value={c.id}>{c.communeName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Street</label>
                <input
                  name="street"
                  value={formDataa.street}
                  onChange={handleChangee}
                  className="w-full p-2 border rounded"
                />
              </div>


              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showCoordinates}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4"
                />
                <label>Add GPS coordinates</label>
              </div>

              {showCoordinates && (
                <div className="space-y-2">
                  <input value={latitude} readOnly className="w-full p-2 border rounded bg-gray-100" />
                  <input value={longitude} readOnly className="w-full p-2 border rounded bg-gray-100" />
                </div>
              )}

              <div className="flex justify-end gap-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FD4C2A] text-white rounded hover:bg-[#e04324]"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            // ---------- AFFICHAGE NORMAL ----------
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="text-gray-800">
                <h2 className="text-xl font-medium text-[#FD4C2A]">{address.title}</h2>
                <p className="capitalize">{address.street}</p>
                <p>{address.commune?.communeName}, {address.province?.provinceName}</p>
                <p>{address.region?.regionName}</p>
              </div>

              <div className="flex gap-3 items-center">
                <button
                  className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm"
                  onClick={handleEditAddressClick}
                >
                  <FaEdit /> Edit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="Payment">
        <span className="text-gray-600 font-bold">Payment</span>
        <Link to="/Payment-form" className="PaymentLink">
          Manage Stripe Connect Account 
        </Link>
      </div>

      {isEditable && (
        <div className="mt-6 text-right">
          <button
            onClick={handleSaveChanges}
            className="px-6 py-2 text-white bg-[#FD4C2A] rounded-[25px] w-full"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;