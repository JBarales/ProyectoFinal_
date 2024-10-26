import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface DecodedToken {
  colegiado: string;
  rol: string;
  exp: number;
}

const Login: React.FC = () => {
  const [colegiado, setColegiado] = useState('');
  const [dpi, setDpi] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Función para decodificar el token
  const decodeToken = (token: string): DecodedToken => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  
    return JSON.parse(jsonPayload);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await api.post('/auth/login', {
        colegiado,
        dpi,
        fechaNacimiento,
        password,
      });
  
      const token = response.data.token;
      localStorage.setItem('token', token);
  
      const decoded = decodeToken(token); // Decodificar el token
  
      if (decoded.rol === 'admin') {
        navigate('/campaigns');
      } else {
        navigate('/campaigns-view');
      }
    } catch (error) {
      alert('Error en el inicio de sesión');
      console.error('Error:', error);
    }
  };
  

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2 className="text-center">Acceder</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Número de Colegiado</label>
          <input
            type="text"
            className="form-control"
            value={colegiado}
            onChange={(e) => setColegiado(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>DPI</label>
          <input
            type="text"
            className="form-control"
            value={dpi}
            onChange={(e) => setDpi(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Fecha de Nacimiento</label>
          <input
            type="date"
            className="form-control"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default Login;
