// AI Con USA 2026 buzzword bingo
export const BUZZWORDS = [
  'agentic', 'guardrails', 'HITL', 'RAG', 'context engineering',
  'observability', 'MCP', 'fleet', 'orchestration', 'governance',
  'policy theater',
  'human-in-the-loop cosplay', 'speed worship', 'governance after dark',
  'hallucination', 'eval', 'fine-tune', 'prompt injection', 'sandbox',
  'multi-agent', 'autonomous', 'off the rack', 'tailored', 'couture',
  'reasoning', 'tool use', 'memory',
  'embedding', 'vector DB', 'token', 'inference', 'latency',
  'throughput', 'fallback', 'rollback', 'pilot', 'roadmap',
  'POC', 'production', 'foundation model', 'open source', 'closed source'
];

export function generateCard(seed = Date.now()) {
  const shuffled = [...BUZZWORDS].sort(() => 0.5 - hash(seed++));
  const picks = shuffled.slice(0, 24);
  // 5x5 with FREE center
  const card = [];
  for (let i = 0; i < 25; i++) {
    if (i === 12) card.push('FREE');
    else card.push(picks[i < 12 ? i : i - 1]);
  }
  return card;
}

function hash(n) {
  const x = Math.sin(n) * 10000;
  return x - Math.floor(x);
}

export function isWinningCard(marked) {
  // marked: 25-length boolean array
  const lines = [
    [0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24], // rows
    [0,5,10,15,20],[1,6,11,16,21],[2,7,12,17,22],[3,8,13,18,23],[4,9,14,19,24], // cols
    [0,6,12,18,24],[4,8,12,16,20] // diagonals
  ];
  return lines.some(line => line.every(i => marked[i]));
}
