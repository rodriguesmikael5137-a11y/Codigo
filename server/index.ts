import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import articlesRouter from './routes/articles.js';

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota da API
app.use('/api', articlesRouter);

// O SEGREDO ESTÁ AQUI: 
// O seu log mostrou que o Vite joga tudo para '../dist/public'
const clientPath = path.join(__dirname, '../dist/public');

app.use(express.static(clientPath));

export async function startServer(port: any) {
  try {
    app.get('*', (req, res) => {
      // Tenta enviar o index.html da pasta que o Vite criou
      res.sendFile(path.join(clientPath, 'index.html'));
    });

    app.listen(port, '0.0.0.0', () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (err) {
    console.error('Erro crítico:', err);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startServer(process.env.PORT || 3001);
}
