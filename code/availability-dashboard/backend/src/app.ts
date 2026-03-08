import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import equipmentRoutes from './routes/equipmentRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// Use the routes under /api/equipment
app.use('/api/equipment', equipmentRoutes);

app.use(errorHandler);

export default app;
