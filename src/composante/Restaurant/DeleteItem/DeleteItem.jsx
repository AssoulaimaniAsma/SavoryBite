import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AlertBox from "./AlertBox";

export default function DeleteItem() {
  const { foodId } = useParams();
  const navigate = useNavigate();

  const [confirmVisible, setConfirmVisible] = useState(true); // on affiche d'abord la boîte de confirmation
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirmDelete = () => {
    setLoading(true);

    fetch(`http://localhost:8080/restaurant/foodItem/${foodId}/delete`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors de la suppression");
        return res.text();
      })
      .then(() => {
        setShowAlert(true);
        setConfirmVisible(false);
      })
      .catch((err) => {
        console.error("Erreur:", err);
        setError(true);
        setConfirmVisible(false);
      })
      .finally(() => setLoading(false));
  };

  const handleDismiss = () => {
    if (error) {
      navigate(-1);
    } else {
      navigate("/restaurant", { replace: true, state: { reload: true } });
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="p-4">
      {confirmVisible && (
        <AlertBox
          title="Confirm Deletion"
          message="Are you sure you want to delete this item?"
          onClose={handleCancel}
          onConfirm={handleConfirmDelete}
          confirmMode
          loading={loading}
        />
      )}

      {showAlert && (
        <AlertBox
          title="Item Deleted"
          message="The food item has been successfully deleted."
          onClose={handleDismiss}
        />
      )}

      {error && (
        <AlertBox
          title="Deletion Failed"
          message="There was an error deleting the item. Please try again."
          onClose={handleDismiss}
        />
      )}
    </div>
  );
}
