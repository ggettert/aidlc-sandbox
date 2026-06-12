import { test } from 'node:test';
import assert from 'node:assert';
import { generateCard, isWinningCard, BUZZWORDS } from '../src/bingo.js';

test('generateCard returns 25 cells with FREE in center', () => {
  const card = generateCard(42);
  assert.strictEqual(card.length, 25);
  assert.strictEqual(card[12], 'FREE');
});

test('generateCard cells (excl FREE) are drawn from BUZZWORDS', () => {
  const card = generateCard(123);
  card.forEach((cell, i) => {
    if (i === 12) return;
    assert.ok(BUZZWORDS.includes(cell), `${cell} not in BUZZWORDS`);
  });
});

test('BUZZWORDS includes "policy theater"', () => {
  assert.ok(BUZZWORDS.includes('policy theater'));
});

test('BUZZWORDS includes "human-in-the-loop cosplay"', () => {
  assert.ok(BUZZWORDS.includes('human-in-the-loop cosplay'));
});

test('BUZZWORDS includes "speed worship"', () => {
  assert.ok(BUZZWORDS.includes('speed worship'));
});

test('BUZZWORDS includes "governance after dark"', () => {
  assert.ok(BUZZWORDS.includes('governance after dark'));
});

test('BUZZWORDS has no duplicate entries', () => {
  assert.strictEqual(new Set(BUZZWORDS).size, BUZZWORDS.length);
});

test('isWinningCard detects a top row', () => {
  const marked = Array(25).fill(false);
  [0,1,2,3,4].forEach(i => marked[i] = true);
  assert.strictEqual(isWinningCard(marked), true);
});

test('isWinningCard detects a diagonal through FREE', () => {
  const marked = Array(25).fill(false);
  [0,6,12,18,24].forEach(i => marked[i] = true);
  assert.strictEqual(isWinningCard(marked), true);
});

test('isWinningCard returns false on partial row', () => {
  const marked = Array(25).fill(false);
  [0,1,2,3].forEach(i => marked[i] = true);
  assert.strictEqual(isWinningCard(marked), false);
});
