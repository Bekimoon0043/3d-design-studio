import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import healthRouter from './routes/health';
import sceneRouter from './routes/scene';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

// Render (and most PaaS providers) inject PORT at runtime; default to 4000 locally.
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use(express.json({ limit: '2mb' })); // scenes can be moderately large; keep a sane cap

app.use('/api/health', healthRouter);
app.use('/api/scene', sceneRouter);

app.get('/', (_req, res) => {
  res.json({ message: '3D Design Platform API', docs: '/api/health' });
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on port ${PORT}`);
});
