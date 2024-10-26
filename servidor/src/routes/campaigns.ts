import express, { Router, Request, Response, NextFunction } from 'express';
import { verifyToken } from '../middleware/verifyToken';

const router = Router();

// Interfaz para los parámetros de la ruta
interface Params {
  id: string;
}


// Simulación de base de datos en memoria para campañas
const campaigns: Array<{
  id: number;
  titulo: string;
  descripcion: string;
  estado: boolean;
  candidatos: Array<{ nombre: string; votos: number }>;
}> = [];

// Ruta para crear una nueva campaña
router.post(
  '/create',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { titulo, descripcion, estado } = req.body;

      const nuevaCampania = {
        id: campaigns.length + 1,
        titulo,
        descripcion,
        estado: estado || false, // Por defecto deshabilitada
        candidatos: [],
      };

      campaigns.push(nuevaCampania);
      res.status(201).json({ message: 'Campaña creada exitosamente', nuevaCampania });
    } catch (error) {
      next(error); // Pasar el error al middleware de manejo de errores
    }
  }
);

router.post(
  '/:id/vote',
  async (req: Request<Params>, res: Response): Promise<void> => {
    const { id } = req.params;
    const { candidato } = req.body;

    const campaign = campaigns.find((camp) => camp.id === parseInt(id, 10));

    if (!campaign || !campaign.estado) {
      res.status(400).json({ message: 'Campaña no encontrada o no habilitada para votar' });
      return;
    }

    const candidate = campaign.candidatos.find((cand) => cand.nombre === candidato);

    if (!candidate) {
      res.status(404).json({ message: 'Candidato no encontrado' });
      return;
    }

    candidate.votos += 1;
    res.json({ message: 'Voto registrado', campaign });
  }
);

// Ruta para obtener todas las campañas
router.get('/', async (req: Request, res: Response): Promise<void> => {
  res.json(campaigns);
});

// Ruta para habilitar/deshabilitar una campaña
router.put(
  '/toggle/:id',
  async (req: Request<Params>, res: Response): Promise<void> => {
    const { id } = req.params;

    const campaign = campaigns.find((camp) => camp.id === parseInt(id, 10));

    if (!campaign) {
      res.status(404).json({ message: 'Campaña no encontrada' });
      return;
    }

    campaign.estado = !campaign.estado;
    res.json({ message: 'Estado de la campaña actualizado', campaign });
  }
);

// Ruta para agregar un candidato a una campaña
router.put(
  '/add-candidate/:id',
  async (req: Request<Params>, res: Response): Promise<void> => {
    const { id } = req.params;
    const { candidato } = req.body;

    const campaign = campaigns.find((camp) => camp.id === parseInt(id, 10));

    if (!campaign) {
      res.status(404).json({ message: 'Campaña no encontrada' });
      return;
    }

    campaign.candidatos.push(candidato);
    res.json({ message: 'Candidato agregado exitosamente', campaign });
  }
);

// Ruta para eliminar una campaña
router.delete(
  '/delete/:id',
  async (req: Request<Params>, res: Response): Promise<void> => {
    const { id } = req.params;

    const index = campaigns.findIndex((camp) => camp.id === parseInt(id, 10));

    if (index === -1) {
      res.status(404).json({ message: 'Campaña no encontrada' });
      return;
    }

    campaigns.splice(index, 1);
    res.json({ message: 'Campaña eliminada exitosamente' });
  }
);

export default router;