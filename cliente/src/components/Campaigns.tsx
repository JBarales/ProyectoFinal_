// src/components/Campaigns.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

// Definimos las interfaces para candidatos y campañas
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
}

const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState(false);
  const [nuevoCandidato, setNuevoCandidato] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);

  useEffect(() => {
    fetchCampaigns(); // Obtener campañas al cargar el componente
  }, []);

  // Función para obtener las campañas
  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/campaigns', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Campañas obtenidas:', response.data);
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error al obtener las campañas:', error);
    }
  };

  // Función para crear una nueva campaña
  const createCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:4000/campaigns/create',
        { titulo, descripcion, estado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCampaigns(); // Actualizar campañas
      setTitulo('');
      setDescripcion('');
      setEstado(false);
    } catch (error) {
      console.error('Error al crear la campaña:', error);
    }
  };

  // Función para cambiar el estado de una campaña
  const toggleCampaign = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:4000/campaigns/toggle/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCampaigns(); // Actualizar campañas
    } catch (error) {
      console.error('Error al cambiar el estado de la campaña:', error);
    }
  };

  // Función para eliminar una campaña
  const deleteCampaign = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:4000/campaigns/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCampaigns(); // Actualizar campañas
    } catch (error) {
      console.error('Error al eliminar la campaña:', error);
    }
  };

  // Función para agregar un candidato
  const addCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCampaign === null) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:4000/campaigns/add-candidate/${selectedCampaign}`,
        { candidato: nuevoCandidato },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCampaigns(); // Actualizar campañas
      setNuevoCandidato('');
      setSelectedCampaign(null);
    } catch (error) {
      console.error('Error al agregar candidato:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Gestionar Campañas</h1>

      {/* Formulario para crear una nueva campaña */}
      <form onSubmit={createCampaign} className="mb-4">
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </div>
          <div className="col-auto d-flex align-items-center">
            <label className="form-check-label me-2">Habilitada</label>
            <input
              type="checkbox"
              className="form-check-input"
              checked={estado}
              onChange={(e) => setEstado(e.target.checked)}
            />
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-primary">
              Crear Campaña
            </button>
          </div>
        </div>
      </form>

      {/* Listado de campañas */}
      <ul className="list-group">
        {campaigns.map((campaign) => (
          <li key={campaign.id} className="list-group-item mb-3">
            <h5>{campaign.titulo}</h5>
            <p>{campaign.descripcion}</p>
            <p>Estado: {campaign.estado ? 'Habilitada' : 'Deshabilitada'}</p>

            <button
              className="btn btn-secondary me-2"
              onClick={() => toggleCampaign(campaign.id)}
            >
              {campaign.estado ? 'Deshabilitar' : 'Habilitar'}
            </button>

            <button
              className="btn btn-danger me-2"
              onClick={() => deleteCampaign(campaign.id)}
            >
              Eliminar
            </button>

            {/* Agregar candidato */}
            <form onSubmit={addCandidate} className="mt-3">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre del candidato"
                  value={nuevoCandidato}
                  onChange={(e) => setNuevoCandidato(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="btn btn-success"
                  onClick={() => setSelectedCampaign(campaign.id)}
                >
                  Agregar Candidato
                </button>
              </div>
            </form>

            {/* Lista de candidatos */}
            <ul className="mt-3">
              {campaign.candidatos.map((cand) => (
                <li key={cand.nombre}>
                  {cand.nombre} - Votos: {cand.votos}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Campaigns;
