const path = require('path');

export function setupStaticServing(app) {
  // O caminho direto para onde o site está
  const publicPath = path.join(process.cwd(), 'dist', 'public');

  app.use(require('express').static(publicPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}
