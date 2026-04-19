import React from 'react';
import '../styles/template.css';

const EquipmentList = () => {
  return (
    <div className="template-container">
      <div className="template-header">
        <h1>Equipment List</h1>
        <p>View and manage available equipment</p>
      </div>

      <div className="template-content">
        <div className="template-section">
          <h2>Available Equipment</h2>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Available</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Football</td>
                  <td>Outdoor</td>
                  <td>10</td>
                  <td>
                    <button className="btn-small">Edit</button>
                    <button className="btn-small danger">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EquipmentList;