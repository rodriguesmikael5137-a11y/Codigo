import path from 'path';
import express from 'express';

export function setupStaticServing(app: express.Application) {
  const publicPath = path.resolve(process.cwd(), 'dist/public');

  app.use(express.static(publicPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}
