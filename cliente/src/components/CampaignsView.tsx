// src/components/CampaignsView.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Interfaces para candidatos y campañas
interface Candidate {
  nombre: string;
  votos: number;
}

interface Campaign {
  id: number;
  titulo: string;
  descripcion: string;
  estado: boolean;
  candidatos: Candidate[];
  votantes: string[];
}

// Obtener el DPI del usuario desde el token almacenado en localStorage
const getUserDPI = (): string | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    return decoded.dpi; // Retornamos el DPI del usuario
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
};

const CampaignsView: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [yaVoto, setYaVoto] = useState(false); // Estado para verificar si ya votó
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns(); // Obtener campañas al cargar el componente
  }, []);

  // Función para obtener las campañas del backend
  const fetchCampaigns = async () => {
    try {
      const response = await axios.get<Campaign[]>('http://localhost:4000/campaigns');
      setCampaigns(response.data);
      verificarSiYaVoto(response.data); // Verificar si el usuario ya votó
    } catch (error) {
      console.error('Error al obtener campañas:', error);
    }
  };

  // Verificar si el usuario ya ha votado en alguna campaña
  const verificarSiYaVoto = (campaigns: Campaign[]) => {
    const dpi = getUserDPI();
    if (dpi) {
      const votoRegistrado = campaigns.some((camp) => camp.votantes.includes(dpi));
      setYaVoto(votoRegistrado);
      if (votoRegistrado) {
        navigate('/results'); // Redirige a la página de resultados si ya votó
      }
    }
  };

  // Función para registrar el voto
  const vote = async (campaignId: number, candidato: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Por favor, inicia sesión.');
      return;
    }

    try {
      await axios.post(
        `http://localhost:4000/campaigns/${campaignId}/vote`,
        { candidato },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Voto registrado exitosamente');
      navigate('/results'); // Redirige a resultados
    } catch (error) {
      console.error('Error al votar:', error);
      alert('Hubo un error al registrar tu voto.');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Campañas</h1>
      <ul className="list-group">
        {campaigns.map((campaign) => (
          <li key={campaign.id} className="list-group-item mb-3">
            <h2>{campaign.titulo}</h2>
            <p>{campaign.descripcion}</p>
            <p>Estado: {campaign.estado ? 'Habilitada' : 'Deshabilitada'}</p>

            {campaign.estado && (
              <div className="mt-3">
                <h3>Candidatos:</h3>
                <ul className="list-group">
                  {campaign.candidatos.map((cand, index) => (
                    <li
                      key={`${cand.nombre}-${index}`}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {cand.nombre} - Votos: {cand.votos}
                      <button
                        className="btn btn-primary"
                        onClick={() => vote(campaign.id, cand.nombre)}
                      >
                        Votar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CampaignsView;
