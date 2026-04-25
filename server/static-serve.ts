import path from 'path';
import express from 'express';

/**
 * Sets up static file serving for the Express app
 * @param app Express application instance
 */
export function setupStaticServing(app: any) {
  // Servindo os arquivos da pasta que o Vite cria no Render
  app.use(express.static(path.join(process.cwd(), 'dist/public')));

  // Para qualquer outra rota, serve o index.html da pasta correta
  app.get('*', (req: any, res: any, next: any) => {
    // Pula rotas de API
    if (req.path.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.join(process.cwd(), 'dist/public', 'index.html'));
  });
}
