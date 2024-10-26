import React, { useState } from 'react';
import api from '../services/api'; // Importa la instancia de Axios
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [colegiado, setColegiado] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [dpi, setDpi] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Llama al backend para registrar al usuario
      await api.post('/auth/register', {
        colegiado,
        nombre,
        correo,
        dpi,
        fechaNacimiento,
        password,
      });
      alert('Usuario registrado exitosamente');
      navigate('/login'); // Redirige al login después del registro
    } catch (error) {
      alert('Error en el registro');
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2 className="text-center">Crear una cuenta nueva</h2>
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
            pattern="\d{13}" // Validación básica de DPI (13 dígitos)
            required
          />
        </div>
        <div className="mb-3">
          <label>Nombre Completo</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Correo Electrónico</label>
          <input
            type="email"
            className="form-control"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
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
            minLength={6} // Contraseña segura: al menos 6 caracteres
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Registrar
        </button>
      </form>
    </div>
  );
};

export default Register;
