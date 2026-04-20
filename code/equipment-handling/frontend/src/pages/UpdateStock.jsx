import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/template.css";

const UpdateStock = () => {
  const { id } = useParams(); // get equipment ID from URL
  const navigate = useNavigate();

  return (
    <div className="template-container">
      <div className="template-header">
        <h1>Update Stock</h1>
        <p>Manage stock for equipment ID: {id}</p>
      </div>

      <div className="template-section" style={{ textAlign: "center" }}>
        <button
          style={{ margin: "10px", padding: "10px 20px" }}
          onClick={() => navigate(`/add-stock/${id}`)}
        >
          Add Stock
        </button>

        <button
          style={{ margin: "10px", padding: "10px 20px" }}
          onClick={() => navigate(`/remove-stock/${id}`)}
        >
          Remove Stock
        </button>
      </div>
    </div>
  );
};

export default UpdateStock;