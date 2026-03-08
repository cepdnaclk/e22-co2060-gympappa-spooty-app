// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import EquipmentDashboard from './components/EquipmentDashboard';
import Navigation from './components/Navigation';
import './styles/App.css';

import './styles/App.css';
import './styles/footer.css';
import './styles/header.css';
import './styles/navigation.css';
import './styles/template.css';

const App: React.FC = () => {
  return (
    <Router>
      <Navigation />  {/* ✅ Now navigation is reusable */}
      
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/equipment-availability" element={<EquipmentDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
