import React, { useState } from 'react';
import axios from 'axios';

const EquipmentItem = ({ equipment }) => {
  const [remaining, setRemaining] = useState(equipment.remaining_quantity);
  const [issuing, setIssuing] = useState(false);

  const handleIssue = async (quantity) => {
    if (quantity > remaining) {
      alert('Not enough equipment available');
      return;
    }
    setIssuing(true);
    try {
      await axios.post('http://localhost:5000/api/equipment/issue', {
        equipmentId: equipment.id,
        studentId: 1, // Replace with actual student ID
        quantity,
      });
      setRemaining(remaining - quantity);
      alert('Equipment issued successfully');
    } catch (err) {
      alert('Failed to issue equipment');
    }
    setIssuing(false);
  };

  return (
    <div className="equipment-item">
      <h3>{equipment.name}</h3>
      <p>Remaining: {remaining}</p>
      <button onClick={() => handleIssue(1)} disabled={issuing || remaining < 1}>
        Issue 1
      </button>
      <button onClick={() => handleIssue(2)} disabled={issuing || remaining < 2}>
        Issue 2
      </button>
    </div>
  );
};

export default EquipmentItem;