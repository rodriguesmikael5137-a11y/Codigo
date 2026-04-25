import path from 'path';
import express from 'express';

/**
 * Sets up static file serving for the Express app
 * @param app Express application instance
 */
export function setupStaticServing(app: express.Application) {
  // 1. Ajustado para 'dist/public' que é onde o seu build realmente está
  const publicPath = path.join(process.cwd(), 'dist/public');

  app.use(express.static(publicPath));

  // 2. Para qualquer outra rota, serve o index.html da pasta dist/public
  app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return next();
    }
    // Usando path.resolve para não ter erro de "caminho relativo" no Linux do Render
    res.sendFile(path.resolve(publicPath, 'index.html'));
  });
}
