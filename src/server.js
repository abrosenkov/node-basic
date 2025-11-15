import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { logger } from './middleware/logger.js';
import studentsRoutes from './routers/studentsRoutes.js';
import { errors } from 'celebrate';

export const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(logger);

app.use(
  express.json({
    limit: '100kb',
  }),
);
app.use(cors());

app.use((req, res, next) => {
  console.log(`Time: ${new Date().toLocaleString()}`);
  next();
});

app.use(studentsRoutes);

app.get('/test-error', (req, res) => {
  throw new Error('Something went wrong');
});

app.use(notFoundHandler);

app.use(errors());

app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
