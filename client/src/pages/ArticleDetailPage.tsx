import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ArticlesPage } from './pages/ArticlesPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { UploadArticlePage } from './pages/UploadArticlePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <nav className="border-b bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">Article Manager</h1>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/upload" element={<UploadArticlePage />} />
            <Route path="/articles/:slug" element={<ArticleDetailPage />} />
            <Route path="/" element={<Navigate to="/articles" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
