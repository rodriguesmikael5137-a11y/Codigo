import path from 'path';
import express from 'express';

export function setupStaticServing(app: express.Application) {
  const publicPath = path.join(process.cwd(), 'dist', 'public');

  // Forçamos o Express a servir os arquivos estáticos na raiz '/'
  app.use('/', express.static(publicPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }
    // Garantimos que ele entregue o index.html da pasta dist
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}
