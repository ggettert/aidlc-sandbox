import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { generateCard, BUZZWORDS } from './bingo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/card', (_req, res) => {
  res.json({ card: generateCard(), buzzwords: BUZZWORDS });
});

app.get('/api/healthz', (_req, res) => res.json({ ok: true }));

const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Conference Bingo on http://localhost:${port}`));
}

export default app;
