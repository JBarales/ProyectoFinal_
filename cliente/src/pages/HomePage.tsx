import React, { useEffect, useState } from 'react';
import api from '../services/api';

const HomePage: React.FC = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await api.get('/campaigns');
        setCampaigns(response.data);
      } catch (error) {
        console.error('Error al obtener las campañas:', error);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div>
      <h1>Campañas Disponibles</h1>
      <ul>
        {campaigns.map((campaign: any) => (
          <li key={campaign.id}>{campaign.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
