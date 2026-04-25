import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import articlesRouter from './routes/articles.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota da API
app.use('/api', articlesRouter);

// Servir arquivos da pasta 'client'
// O '..' serve para sair da pasta 'server' e achar a 'client' na raiz
const clientPath = path.join(__dirname, '../client');
app.use(express.static(clientPath));

export async function startServer(port: any) {
  try {
    // Rota curinga: Se não for API, entrega o index.html
    app.get('*', (req, res) => {
      res.sendFile(path.join(clientPath, 'index.html'));
    });

    app.listen(port, '0.0.0.0', () => {
      console.log(`API Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startServer(process.env.PORT || 3001);
}
