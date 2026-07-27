import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

// Middlewares
import corsMiddleware from './middleware/corsMiddleware';
import { notFound, errorHandler } from './middleware/errorHandler';

// Configs
import './config/firebase';

// Route imports
import personalRoutes from './routes/personalRoutes';
import projectsRoutes from './routes/projectsRoutes';
import skillsRoutes from './routes/skillsRoutes';
import experienceRoutes from './routes/experienceRoutes';
import educationRoutes from './routes/educationRoutes';
import certificationsRoutes from './routes/certificationsRoutes';
import achievementsRoutes from './routes/achievementsRoutes';
import testimonialsRoutes from './routes/testimonialsRoutes';
import contactRoutes from './routes/contactRoutes';
import mediaRoutes from './routes/mediaRoutes';

const app = express();
const PORT: number = parseInt(process.env.PORT || '5000', 10);

// Security & Logging Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static Assets Serving
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use('/data', express.static(path.join(__dirname, '../data')));

// Root Health Check Route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    message: 'Sifat Khan Portfolio API Server (TypeScript) is running.',
    timestamp: new Date().toISOString(),
    stack: {
      language: 'TypeScript',
      framework: 'Express.js',
      orm: 'Prisma',
      database: 'PostgreSQL',
      storage: 'Cloudinary',
      auth: 'Firebase Admin SDK',
    },
  });
});

// API Routes — Dynamic CRUD Endpoints
app.use('/api/personal', personalRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/certifications', certificationsRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/media', mediaRoutes);

// 404 Not Found Handler for undefined routes
app.use(notFound);

// Global Error Handling Middleware
app.use(errorHandler);

// Process-level unhandled exception and rejection handlers
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('[Process Error] Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error: any) => {
  if (error.code === 'EADDRINUSE') {
    console.warn('[Process Error] Port conflict detected (EADDRINUSE). Fallback port in progress.');
  } else {
    console.error('[Process Error] Uncaught Exception thrown:', error);
  }
});

// Start Server Listener with Automatic Port Fallback
const startServer = (port: number) => {
  const server = app
    .listen(port)
    .on('listening', () => {
      console.log(`==================================================`);
      console.log(`  🚀 TypeScript Portfolio Server Running on Port ${port}`);
      console.log(`  🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`  🗄️  Prisma + PostgreSQL ORM Ready`);
      console.log(`  📸 Cloudinary Upload Engine Ready`);
      console.log(`  🔥 Firebase Admin SDK Ready`);
      console.log(`  🛡️  Global 404 & Port Auto-Fallback Active`);
      console.log(`  📡 Dynamic API Endpoints:`);
      console.log(`     /api/personal`);
      console.log(`     /api/projects`);
      console.log(`     /api/skills`);
      console.log(`     /api/experience`);
      console.log(`     /api/education`);
      console.log(`     /api/certifications`);
      console.log(`     /api/achievements`);
      console.log(`     /api/testimonials`);
      console.log(`     /api/contact`);
      console.log(`     /api/media`);
      console.log(`==================================================`);
    })
    .on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`[Port Conflict] Port ${port} is occupied. Attempting port ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error('[Server Error]', err);
      }
    });

  return server;
};

const serverInstance = startServer(PORT);

export default serverInstance;
