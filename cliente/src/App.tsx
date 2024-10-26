import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import Register from './components/Register';
import Campaigns from './components/Campaigns'; 
import CampaignsView from './components/CampaignsView'; 
import CampaignResults from './components/CampaignResults'; 
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS

const getUserDataFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const { dpi, rol } = decodedPayload;
    return { dpi, rol };
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    localStorage.clear();
    return null;
  }
};

const App: React.FC = () => {
  const [userData, setUserData] = useState<{ rol: string } | null>(null);

  useEffect(() => {
    const user = getUserDataFromToken();
    setUserData(user);
  }, []);

  return (
    <div className="container mt-5"> {/* Contenedor con márgenes */}
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/campaigns"
            element={
              userData?.rol === 'admin' ? (
                <Campaigns />
              ) : (
                <Navigate to="/campaigns-view" />
              )
            }
          />

          <Route
            path="/campaigns-view"
            element={
              userData?.rol === 'admin' ? (
                <Navigate to="/campaigns" />
              ) : (
                <CampaignsView />
              )
            }
          />

          <Route
            path="/results"
            element={userData ? <CampaignResults /> : <Navigate to="/login" />}
          />

          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;