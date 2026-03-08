import React from 'react';
import EquipmentItem from './EquipmentItem';

const SportEquipmentList = ({ sport }) => {
  return (
    <div className="sport-equipment-list">
      <h2>{sport.name} Equipment</h2>
      <div className="equipment-grid">
        {sport.equipments.map((equipment) => (
          <EquipmentItem key={equipment.id} equipment={equipment} />
        ))}
      </div>
    </div>
  );
};

export default SportEquipmentList;