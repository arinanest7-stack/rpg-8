import express from 'express';
import cors from 'cors';
import questRoutes from './routes/quest.routes';

export const app = express();

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', service: 'RPG Study Quest Backend', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/quests', questRoutes);
