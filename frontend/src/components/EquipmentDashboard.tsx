// src/components/EquipmentDashboard.tsx
import React, { useEffect, useState } from 'react';
import EquipmentCard from './EquipmentCard';
import { Equipment, EquipmentAPI } from '../types';

const sports = [
  { id: 1, name: "Badminton" },
  { id: 2, name: "Baseball" },
  { id: 3, name: "Basketball" },
  { id: 4, name: "Boxing" },
  { id: 5, name: "Chess" },
  { id: 6, name: "Cricket" },
  { id: 7, name: "Elle" },
  { id: 8, name: "Football" },
  { id: 9, name: "Hockey" },
  { id: 10, name: "Rugby" },
  { id: 11, name: "Table Tennis" },
  { id: 12, name: "Tennis" },
  { id: 13, name: "Track and Field" },
  { id: 14, name: "Volleyball" }
];

const EquipmentDashboard: React.FC = () => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openSport, setOpenSport] = useState<number | null>(null);
  const [issuedCounts, setIssuedCounts] = useState<{ [id: number]: number }>({});
  const [confirmMessage, setConfirmMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch('/api/equipment');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: EquipmentAPI[] = await response.json();
        const formattedData: Equipment[] = data.map(item => ({
          id: item.id,
          sportId: Number(item.sport_id),
          name: item.name,
          totalQuantity: item.total_quantity,
          remainingQuantity: item.remaining_quantity,
        }));
        setEquipmentList(formattedData);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, []);

  const handleIssue = (id: number) => {
    setEquipmentList(prev =>
      prev.map(e => e.id === id ? { ...e, remainingQuantity: e.remainingQuantity - 1 } : e)
    );
    setIssuedCounts(prev => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  };

  const handleReturn = (id: number) => {
    setEquipmentList(prev =>
      prev.map(e => e.id === id ? { ...e, remainingQuantity: e.remainingQuantity + 1 } : e)
    );
    setIssuedCounts(prev => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) - 1) }));
  };

  const toggleSport = (sportId: number) => {
    setOpenSport(prev => (prev === sportId ? null : sportId));
    setIssuedCounts({});
    setConfirmMessage(null);
  };

  const handleConfirm = () => {
    if (openSport === null) return;
    const sportEquipment = equipmentList.filter(eq => eq.sportId === openSport);
    const issuedItems = sportEquipment
      .filter(eq => issuedCounts[eq.id] && issuedCounts[eq.id] > 0)
      .map(eq => `${issuedCounts[eq.id]} ${eq.name}`)
      .join(', ');

    if (!issuedItems) {
      alert('⚠️ No equipment selected to issue!');
      return;
    }

    const studentId = 'E/22/018';
    setConfirmMessage(`✅ You issued: ${issuedItems}`);
    console.log(`Admin notification: Student ${studentId} issued ${issuedItems}`);
    setIssuedCounts({});

    // Auto-hide toast after 3 seconds
    setTimeout(() => setConfirmMessage(null), 3000);
  };

  if (loading) return (
    <div className="template-container">
      <div className="template-header">
        <p>⏳ Loading equipment...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="template-container">
      <div className="template-header">
        <p style={{ color: 'var(--color-error)' }}>❌ Failed to load equipment: {error}</p>
      </div>
    </div>
  );

  return (
    <div className="template-container">

      {/* Toast Notification - fixed bottom center */}
      {confirmMessage && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#155724',
          color: 'white',
          padding: '15px 30px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 9999,
          fontSize: '16px',
          fontWeight: '600',
          whiteSpace: 'nowrap',
        }}>
          {confirmMessage}
        </div>
      )}

      {/* Page Header */}
      <div className="template-header">
        <h1>Equipment Availability Dashboard</h1>
        <p>Select a sport to view and issue equipment</p>
      </div>

      {/* Sports List */}
      <div className="template-content">
        {sports.map(sport => {
          const sportEquipment = equipmentList.filter(eq => eq.sportId === sport.id);
          const isOpen = openSport === sport.id;

          return (
            <div key={sport.id} className="template-section">

              {/* Sport Header - clickable */}
              <h2
                onClick={() => toggleSport(sport.id)}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: isOpen ? '20px' : '0'
                }}
              >
                <span>🏅 {sport.name}</span>
                <span style={{ fontSize: '14px', color: 'var(--color-text-light)' }}>
                  {sportEquipment.length} item{sportEquipment.length !== 1 ? 's' : ''} {isOpen ? '▲' : '▼'}
                </span>
              </h2>

              {/* Equipment Table */}
              {isOpen && (
                <>
                  {sportEquipment.length === 0 ? (
                    <p style={{ color: 'var(--color-text-light)' }}>No equipment listed for this sport.</p>
                  ) : (
                    <>
                      <div className="table-container">
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Equipment</th>
                              <th>Available</th>
                              <th>Total</th>
                              <th>Issue / Return</th>
                              <th>Issued by You</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sportEquipment.map(eq => (
                              <tr key={eq.id}>
                                <td><strong>{eq.name}</strong></td>
                                <td>
                                  <span className={eq.remainingQuantity > 0 ? 'available' : 'unavailable'}>
                                    {eq.remainingQuantity}
                                  </span>
                                </td>
                                <td>{eq.totalQuantity}</td>
                                <td>
                                  <button
                                    className="btn-small danger"
                                    onClick={() => handleReturn(eq.id)}
                                    disabled={(issuedCounts[eq.id] ?? 0) === 0}
                                  >
                                    − Return
                                  </button>
                                  <button
                                    className="btn-small"
                                    onClick={() => handleIssue(eq.id)}
                                    disabled={eq.remainingQuantity === 0 || (issuedCounts[eq.id] ?? 0) >= 2}
                                  >
                                    + Issue
                                  </button>
                                </td>
                                <td>{issuedCounts[eq.id] ?? 0}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="form-actions">
                        <button className="button" onClick={handleConfirm}>
                          ✅ Confirm Issue
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EquipmentDashboard;