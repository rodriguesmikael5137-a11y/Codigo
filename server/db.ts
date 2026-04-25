import { Kysely, SqliteDialect } from 'kysely';
import BetterSqlite3 from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ArticlesTable {
  id: string;
  title: string;
  slug: string;
  content: string;
  contentType: 'markdown' | 'html';
  createdAt: number;
  updatedAt: number;
}

interface DatabaseSchema {
  articles: ArticlesTable;
}

const sqliteDb = new BetterSqlite3(path.join(__dirname, '../data/database.sqlite'));

export const db = new Kysely<DatabaseSchema>({
  dialect: new SqliteDialect({ database: sqliteDb }),
  log: ['query', 'error']
});
