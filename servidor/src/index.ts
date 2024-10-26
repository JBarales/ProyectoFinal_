import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import campaignRoutes from './routes/campaigns'; // Asegúrate que esta importación es correcta

dotenv.config(); // Cargar las variables de entorno

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors()); // Habilita CORS para las peticiones
app.use(express.json()); // Habilita el parseo de JSON

// Usa las rutas de autenticación con prefijo '/auth'
app.use('/auth', authRoutes);
app.use('/campaigns', campaignRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});