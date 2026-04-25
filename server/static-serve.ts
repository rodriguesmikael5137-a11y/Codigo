import path from 'path';
import express from 'express';

export function setupStaticServing(app: express.Application) {
  // O caminho sai de 'server' e entra em 'dist/public'
  const publicPath = path.resolve(__dirname, '..', 'dist', 'public');

  app.use(express.static(publicPath));

  app.get('*', (req: any, res: any, next: any) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}
