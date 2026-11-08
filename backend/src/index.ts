  import express from 'express';
  import cors from 'cors';
  import entriesRouter from './routes/entries';

  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  app.use('/api/entries', entriesRouter);

  app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
  });