import path from 'path';
import express from 'express';

/**
 * Sets up static file serving for the Express app
 * @param app Express application instance
 */
export function setupStaticServing(app: express.Application) {
  // Voltando para a sintaxe identica ao seu original que dava verde
  app.use(express.static(path.join(process.cwd(), "dist", "public")));

  app.get('/{*splat}', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }
    // Apontando para o index.html dentro de dist/public
    res.sendFile(path.join(process.cwd(), "dist", "public", "index.html"));
  });
}
