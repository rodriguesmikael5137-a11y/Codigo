import express from 'express';
import { db } from '../db.js';
import { randomBytes } from 'crypto';

const router = express.Router();

function generateId(): string {
  return randomBytes(16).toString('hex');
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Get all articles
router.get('/articles', async (req: express.Request, res: express.Response) => {
  try {
    const articles = await db
      .selectFrom('articles')
      .select(['id', 'title', 'slug', 'createdAt', 'updatedAt'])
      .orderBy('createdAt', 'desc')
      .execute();
    
    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Get single article by slug
router.get('/articles/:slug', async (req: express.Request, res: express.Response) => {
  try {
    const { slug } = req.params;
    const article = await db
      .selectFrom('articles')
      .selectAll()
      .where('slug', '=', slug)
      .executeTakeFirst();
    
    if (!article) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }
    
    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// Create article
router.post('/articles', async (req: express.Request, res: express.Response) => {
  try {
    const { title, content, contentType } = req.body;
    
    if (!title || !content || !contentType) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    
    if (!['markdown', 'html'].includes(contentType)) {
      res.status(400).json({ error: 'Invalid content type' });
      return;
    }
    
    let slug = slugify(title);
    let counter = 1;
    const baseSlug = slug;
    
    while (true) {
      const existing = await db
        .selectFrom('articles')
        .select('id')
        .where('slug', '=', slug)
        .executeTakeFirst();
      
      if (!existing) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    const id = generateId();
    const now = Date.now();
    
    const article = await db
      .insertInto('articles')
      .values({
        id,
        title,
        slug,
        content,
        contentType,
        createdAt: now,
        updatedAt: now
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    
    res.status(201).json(article);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

// Update article
router.put('/articles/:id', async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { title, content, contentType } = req.body;
    
    const existing = await db
      .selectFrom('articles')
      .select('slug')
      .where('id', '=', id)
      .executeTakeFirst();
    
    if (!existing) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }
    
    const article = await db
      .updateTable('articles')
      .set({
        title: title || undefined,
        content: content || undefined,
        contentType: contentType || undefined,
        updatedAt: Date.now()
      })
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow();
    
    res.json(article);
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ error: 'Failed to update article' });
  }
});

// Delete article
router.delete('/articles/:id', async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    
    await db
      .deleteFrom('articles')
      .where('id', '=', id)
      .execute();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

export default router;
