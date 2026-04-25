import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import articlesRouter from './routes/articles.js';

// 1. Configurações Iniciais
dotenv.config();
const app = express();

// Necessário para converter caminhos de pasta no Node moderno
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Middlewares (Os "ajudantes" do servidor)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Rotas da API (O cérebro do tradutor)
app.use('/api', articlesRouter);

// 4. Configuração da Pasta do Site (Onde está o seu index.html)
// Usamos '../client' porque o servidor está na pasta 'server' e precisa subir um nível
const clientPath = path.join(__dirname, '../client');

// Diz ao servidor para liberar o acesso aos arquivos da pasta client
app.use(express.static(clientPath));

// 5. Função para Iniciar o Servidor
export async function startServer(port: any) {
  try {
    // Rota Curinga: Se o usuário acessar qualquer coisa que não seja a API,
    // o servidor entrega o seu index.html que está na pasta client.
    app.get('*', (req, res) => {
      res.sendFile(path.join(clientPath, 'index.html'));
    });

    app.listen(port, '0.0.0.0', () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (err) {
    console.error('Erro ao iniciar servidor:', err);
    process.exit(1);
  }
}

// 6. Execução Direta
if (import.meta.url === `file://${process.argv[1]}`) {
  const PORT = process.env.PORT || 3001;
  startServer(PORT);
}
