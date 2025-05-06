import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Account_Setting.css";


const AccountSettings = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    oldPassword: "",
    newPassword: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return navigate("/client/signin");

    const fetchAccountDetails = async () => {
      try {
        const res = await fetch("http://localhost:8080/user/accountDetails", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch");

        const user = await res.json();

        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: user.phone || "",
          oldPassword: "",
          newPassword: "",
        });

        setProfileImageUrl(user.profileImg || "");
      } catch (err) {
        console.error("Erreur récupération compte:", err);
      }
    };

    fetchAccountDetails();
  }, [navigate]);

  const userInitials =
    (formData.firstName[0] || "") + (formData.lastName[0] || "");

  // ✅ MODIFIÉ : Enregistrer juste le chemin relatif
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

    if (!/^[A-Za-z]+(?:\s[A-Za-z]+)*$/.test(formData.firstName)) {
      newErrors.firstName = "Le prénom ne doit contenir que des lettres et des espaces entre les mots.";
    }
    if (!/^[A-Za-z]+(?:\s[A-Za-z]+)*$/.test(formData.lastName)) {
      newErrors.lastName = "Le nom ne doit contenir que des lettres et des espaces entre les mots.";
    }    
    if (
      !/^[a-zA-Z0-9._%+-]+@(gmail|yahoo|hotmail|outlook|live|protonmail|icloud|aol|zoho|mail|yandex|gmx|fastmail)\.[a-zA-Z]{2,}$/.test(
        formData.email
      )
    ) {
      newErrors.email = "Adresse email invalide.";
    }
    if (!/^(?:\+2126|06|07|\+2127)\d{8}$/.test(formData.phone)) {
      newErrors.phone =
        "Numéro invalide. Format : +2126xxxxxxxx ou 06xxxxxxxx";
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

    const token = localStorage.getItem("authToken");
    if (!token) return navigate("/client/signin");

    const formDataToSend = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    };

    // ✅ Envoi du chemin image
    if (profileImageUrl) {
      formDataToSend.profileImg = profileImageUrl;
    }

    try {
      const res = await fetch("http://localhost:8080/user/updateAccountDetails", {
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

  const handleEditClick = () => setIsEditable(true);

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

      <div className="flex items-center space-x-4">
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
            <span className="text-lg font-bold text-gray-600">
              {userInitials.toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold">
            {formData.firstName} {formData.lastName}
          </h3>
          <p className="text-gray-500">{formData.email}</p>
        </div>
      </div>

      <div className="EditDiv mt-4 flex justify-between">
        <label className="EditProfile">
          Change Profile Picture
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>

        {!isEditable && (
          <button className="EditButton" onClick={handleEditClick}>
            Edit
          </button>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {["firstName", "lastName", "email", "phone"].map((field) => (
          <div key={field}>
            <label className="text-gray-600 capitalize">{field}</label>
            <input
              type={field === "email" ? "email" : "text"}
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
          <div>
            <label className="text-gray-600">Old Password</label>
            <input
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="text-gray-600">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm">{errors.newPassword}</p>
            )}
          </div>
        </div>
      )}

      <div className="Address mt-6">
        <span>Address</span>
        <Link to={`/client/allAddress`} className="addressLink">
          Manage Address
        </Link>
      </div>
      <div className="Payment">
        <span>Payment</span>
        <Link to="/client/ManagePayment" className="PaymentLink">
          Manage Payment Methods
        </Link>
      </div>

      <div className="mt-6 text-right">
        <button
          onClick={isEditable ? handleSaveChanges : handleEditClick}
          className="px-6 py-2 text-white bg-[#FD4C2A] rounded-[25px] w-full"
        >
          {isEditable ? "Save Changes" : "Edit"}
        </button>
      </div>
    </div>
  );
};

export default AccountSettings;