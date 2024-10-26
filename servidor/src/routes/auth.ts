import express, { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();
const secret = process.env.JWT_SECRET || 'secreto';

// Simulación de base de datos en memoria
const usuarios: Array<{
  colegiado: string;
  nombre: string;
  correo: string;
  dpi: string;
  fechaNacimiento: string;
  password: string;
}> = [];

const inicializarAdmin = async () => {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  usuarios.push({
    colegiado: 'admin',
    nombre: 'Administrador',
    correo: 'admin@admin.com',
    dpi: '123456789',
    fechaNacimiento: '1990-01-01',
    password: hashedPassword,
  });
};

// Ejecuta la inicialización del administrador al cargar el módulo
inicializarAdmin().catch((error) => console.error('Error al inicializar admin:', error));


// Ruta para registrar usuarios
router.post(
  '/register',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { colegiado, nombre, correo, dpi, fechaNacimiento, password } = req.body;

      const existe = usuarios.find(
        (user) => user.colegiado === colegiado || user.dpi === dpi
      );

      if (existe) {
        res.status(400).json({ message: 'Usuario ya registrado' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      usuarios.push({
        colegiado,
        nombre,
        correo,
        dpi,
        fechaNacimiento,
        password: hashedPassword,
      });

      res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
      next(error);
    }
  }
);

// Ruta de Login
router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { colegiado, dpi, fechaNacimiento, password } = req.body;

      console.log('Datos recibidos:', req.body);

      const usuario = usuarios.find(
        (user) =>
          user.colegiado === colegiado &&
          user.dpi === dpi &&
          user.fechaNacimiento === fechaNacimiento
      );

      if (!usuario) {
        console.log('Usuario no encontrado');
        res.status(401).json({ message: 'Usuario no encontrado o datos incorrectos' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, usuario.password);
      console.log('¿Contraseña válida?', isPasswordValid);

      if (!isPasswordValid) {
        res.status(401).json({ message: 'Contraseña incorrecta' });
        return;
      }

      // Asignar rol según el usuario
      const rol = usuario.colegiado === 'admin' ? 'admin' : 'user';
      console.log('Rol asignado:', rol);

      const token = jwt.sign(
        { colegiado: usuario.colegiado, rol }, // Incluye el rol
        secret,
        { expiresIn: '1h' }
      );

      res.json({ token });
    } catch (error) {
      console.error('Error en el proceso de login:', error);
      next(error);
    }
  }
);


export default router;
