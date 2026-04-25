import path from 'path';
import express from 'express';

export function setupStaticServing(app: express.Application) {
  // Usamos o caminho que o seu servidor já aceitou antes (Verde)
  // Mas garantimos que ele aponte para a pasta de build 'dist/public'
  const publicPath = path.join(process.cwd(), 'dist', 'public');

  app.use(express.static(publicPath));

  app.get('*', (req: any, res: any, next: any) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }
    // O segredo aqui é garantir que o HTML seja servido da pasta dist
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}
