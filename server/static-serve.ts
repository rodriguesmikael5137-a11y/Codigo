import path from 'path';
import express from 'express';

/**
 * Sets up static file serving for the Express app
 * @param app Express application instance
 */
export function setupStaticServing(app: express.Application) {
  const publicPath = path.join(process.cwd(), "dist", "public");

  // Mantemos o padrão que deu Verde, mas garantimos o mapeamento da raiz
  app.use("/", express.static(publicPath));

  app.get('/{*splat}', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }
    // Forçamos o envio do index.html correto
    res.sendFile(path.join(publicPath, "index.html"));
  });
}
