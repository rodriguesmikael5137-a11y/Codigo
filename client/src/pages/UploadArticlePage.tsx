import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card } from '../components/ui/card';

export function UploadArticlePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [contentType, setContentType] = useState<'markdown' | 'html'>('markdown');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!file) {
      setError('Please select a file');
      return;
    }

    try {
      setLoading(true);
      const content = await file.text();

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content,
          contentType
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload article');
      }

      const article = await response.json();
      navigate(`/articles/${article.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Upload Article</h1>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Article Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter article title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contentType">Content Type</Label>
            <Select value={contentType} onValueChange={(v) => setContentType(v as 'markdown' | 'html')}>
              <SelectTrigger id="contentType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="markdown">Markdown</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Upload File</Label>
            <Input
              id="file"
              type="file"
              accept={contentType === 'markdown' ? '.md,.txt' : '.html,.htm'}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={loading}
            />
            <p className="text-sm text-gray-500">
              {contentType === 'markdown'
                ? 'Upload a .md or .txt file'
                : 'Upload an .html or .htm file'}
            </p>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload Article'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/articles')}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="font-semibold mb-3">Tips for your articles:</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>✓ Embed YouTube videos: Use &lt;iframe&gt; tags with src like "https://www.youtube.com/embed/VIDEO_ID"</li>
          <li>✓ Embed images: Reference external URLs (e.g., from Imgur, Unsplash, or any image hosting)</li>
          <li>✓ For Markdown: Use standard ![alt text](image-url) for images</li>
          <li>✓ For HTML: Use &lt;img src="image-url"&gt; for images and &lt;iframe&gt; for videos</li>
        </ul>
      </div>
    </div>
  );
}
