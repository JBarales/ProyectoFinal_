// src/components/CampaignResults.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Interfaces para candidatos y campañas
interface Candidate {
  nombre: string;
  votos: number;
}

interface Campaign {
  id: number;
  titulo: string;
  descripcion: string;
  candidatos: Candidate[];
}

const CampaignResults: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  // Cargar los datos de todas las campañas al montar el componente
  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get<Campaign[]>('http://localhost:4000/campaigns');
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error al obtener las campañas:', error);
    }
  };

  return (
    <div>
      <h1>Resultados de Votación</h1>
      {campaigns.length === 0 ? (
        <p>No hay campañas registradas.</p>
      ) : (
        campaigns.map((campaign) => (
          <div key={campaign.id} style={{ marginBottom: '40px' }}>
            <h2>{campaign.titulo}</h2>
            <p>{campaign.descripcion}</p>
            <Bar
              data={{
                labels: campaign.candidatos.map((cand) => cand.nombre),
                datasets: [
                  {
                    label: 'Votos',
                    data: campaign.candidatos.map((cand) => cand.votos),
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  title: {
                    display: true,
                    text: `Resultados de la Campaña: ${campaign.titulo}`,
                  },
                },
              }}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default CampaignResults;
