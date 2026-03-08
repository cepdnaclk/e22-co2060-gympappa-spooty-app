import React from 'react';

interface EquipmentCardProps {
  id: number;
  name: string;
  totalQuantity: number;
  remainingQuantity: number;
  onIssue: (id: number) => void;
  onReturn: (id: number) => void;
  issuedCount?: number;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({
  id,
  name,
  totalQuantity,
  remainingQuantity,
  onIssue,
  onReturn,
  issuedCount = 0,
}) => {
  const canIssue = remainingQuantity > 0 && issuedCount < 2;
  const canReturn = issuedCount > 0;

  return (
    <div
      className="equipment-card"
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        margin: '5px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <h3>{name}</h3>
        <p>
          {remainingQuantity} / {totalQuantity} available
        </p>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => onReturn(id)}
          disabled={!canReturn}
          style={{
            padding: '5px 10px',
            backgroundColor: canReturn ? '#f44336' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: canReturn ? 'pointer' : 'not-allowed',
          }}
        >
          -
        </button>
        <button
          onClick={() => onIssue(id)}
          disabled={!canIssue}
          style={{
            padding: '5px 10px',
            backgroundColor: canIssue ? '#4CAF50' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: canIssue ? 'pointer' : 'not-allowed',
          }}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default EquipmentCard;
