import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'secreto';

export interface CustomJwtPayload extends jwt.JwtPayload {
  dpi: string;
  rol: string;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const authHeader = req.header('Authorization');
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
        return reject();
      }

      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          res.status(401).json({ message: 'Token inválido o expirado.' });
          return reject(err);
        }

        req.user = decoded as CustomJwtPayload; // Asignar el tipo CustomJwtPayload
        resolve();
        next(); // Continuar al siguiente middleware
      });
    } catch (err) {
      console.error('Error en la verificación del token:', err);
      res.status(500).json({ message: 'Error interno del servidor' });
      reject(err);
    }
  });
};