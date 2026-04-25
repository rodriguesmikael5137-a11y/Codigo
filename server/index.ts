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

// Rotas da API
app.use('/api', articlesRouter);

// O SEU LOG MOSTROU ISSO: O Vite coloca tudo em '../dist/public'
// Vamos usar um caminho relativo que funciona tanto local quanto no Render
const clientPath = path.resolve(__dirname, '../dist/public');

app.use(express.static(clientPath));

export async function startServer(port: any) {
  try {
    app.get('*', (req, res) => {
      res.sendFile(path.join(clientPath, 'index.html'));
    });

    app.listen(port, '0.0.0.0', () => {
      console.log(`Servidor ON na porta ${port}`);
    });
  } catch (err) {
    console.error('Erro ao ligar:', err);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startServer(process.env.PORT || 3001);
}
