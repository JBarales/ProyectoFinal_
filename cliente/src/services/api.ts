import axios from 'axios';

// Crea una instancia de Axios con la URL base del backend
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000',
});

// Interceptor para agregar el JWT en los headers de cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Obtener el JWT del localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Agrega el JWT al header
  }
  return config;
}, (error) => {
  return Promise.reject(error); // Maneja errores
});

export default api;
