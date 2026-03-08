import React from 'react';

interface AvailabilityStatusProps {
    remainingQuantity: number;
    totalQuantity: number;
}

const AvailabilityStatus: React.FC<AvailabilityStatusProps> = ({ remainingQuantity, totalQuantity }) => {
    const availabilityPercentage = (remainingQuantity / totalQuantity) * 100;

    return (
        <div className="availability-status">
            <h3>Availability Status</h3>
            <p>{remainingQuantity} out of {totalQuantity} available</p>
            <div className="availability-bar" style={{ width: `${availabilityPercentage}%`, backgroundColor: 'green', height: '20px' }} />
        </div>
    );
};

export default AvailabilityStatus;