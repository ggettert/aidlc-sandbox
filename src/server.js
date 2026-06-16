import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { generateCard, BUZZWORDS, LINES } from './bingo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/card', (_req, res) => {
  res.json({ card: generateCard(), buzzwords: BUZZWORDS });
});

// BINGO-12 (Tech Spec §API contract): report marked-square count + win state.
// Card state lives client-side, so the client passes its `marked` array as a
// comma-separated list of 25 0/1 values; the server validates and counts.
app.get('/api/status', (req, res) => {
  const raw = req.query.marked;
  if (raw === undefined) {
    return res.status(400).json({ error: 'marked query param is required' });
  }
  const parts = String(raw).split(',');
  if (parts.length !== 25) {
    return res.status(400).json({ error: 'marked must contain exactly 25 values' });
  }
  if (!parts.every(p => p === '0' || p === '1')) {
    return res.status(400).json({ error: 'marked values must each be 0 or 1' });
  }
  const marked = parts.map(p => p === '1');
  if (marked[12] !== true) {
    return res.status(400).json({ error: 'free space (index 12) must be marked' });
  }
  const count = marked.reduce((n, m) => n + (m ? 1 : 0), 0);
  const won = LINES.some(line => line.every(i => marked[i]));
  res.json({ marked: count, total: 25, won });
});

app.get('/api/healthz', (_req, res) => res.json({ ok: true }));

const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Conference Bingo on http://localhost:${port}`));
}

export default app;
