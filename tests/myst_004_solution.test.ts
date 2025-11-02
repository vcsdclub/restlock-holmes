/**
 * Vitest Unit Tests for Mystery 004: The Interdimensional Character Count
 */

import { describe, it, expect, beforeAll } from 'vitest';

const BASE_URL = 'http://localhost:5173';
const RICK_MORTY_API_BASE = 'https://rickandmortyapi.com/api';

interface TestResult {
	clueId: string;
	answer: string;
	correct: boolean;
}

describe('Mystery 004: The Interdimensional Character Count', () => {
	let mystery: any;
	const results: TestResult[] = [];

	beforeAll(async () => {
		// Get the mystery
		const mysteryRes = await fetch(`${BASE_URL}/mystery?mysteryId=myst_004`);
		const mysteryData = await mysteryRes.json();
		mystery = mysteryData;
	});

	it('should fetch the correct mystery (myst_004)', () => {
		expect(mystery).toBeDefined();
		expect(mystery.mysteryId).toBe('myst_004');
		expect(mystery.title).toBeDefined();
		expect(mystery.scenario).toBeDefined();
		expect(mystery.currentClue).toBeDefined();
	});

	it('should solve clue 1: count alive characters on first page', async () => {
		const charactersRes = await fetch(`${RICK_MORTY_API_BASE}/character/?status=alive`);
		const charactersData = await charactersRes.json();

		expect(charactersData).toBeDefined();
		expect(charactersData.results).toBeDefined();
		expect(Array.isArray(charactersData.results)).toBe(true);

		const answer1 = charactersData.results.length.toString();
		expect(parseInt(answer1)).toBeGreaterThan(0);

		// Submit answer
		const submitRes = await fetch(`${BASE_URL}/submit`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				mysteryId: mystery.mysteryId,
				clueId: mystery.currentClue.id,
				answer: answer1
			})
		});

		const submitData = await submitRes.json();
		results.push({
			clueId: mystery.currentClue.id,
			answer: answer1,
			correct: submitData.correct
		});

		expect(submitData.correct).toBe(true);
		expect(submitData.nextClue).toBeDefined();
	});

	it('should solve clue 2: count episodes for Rick Sanchez', async () => {
		// Re-submit clue 1 to get clue 2
		const charactersRes = await fetch(`${RICK_MORTY_API_BASE}/character/?status=alive`);
		const charactersData = await charactersRes.json();
		const answer1 = charactersData.results.length.toString();

		const clue1Res = await fetch(`${BASE_URL}/submit`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				mysteryId: mystery.mysteryId,
				clueId: mystery.currentClue.id,
				answer: answer1
			})
		});
		const clue1Data = await clue1Res.json();
		const clue2 = clue1Data.nextClue;

		expect(clue2).toBeDefined();

		// Get Rick Sanchez (character ID 1)
		const rickRes = await fetch(`${RICK_MORTY_API_BASE}/character/1`);
		const rickData = await rickRes.json();

		expect(rickData).toBeDefined();
		expect(rickData.episode).toBeDefined();
		expect(Array.isArray(rickData.episode)).toBe(true);

		const answer2 = rickData.episode.length.toString();

		// Submit answer
		const submitRes = await fetch(`${BASE_URL}/submit`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				mysteryId: mystery.mysteryId,
				clueId: clue2.id,
				answer: answer2
			})
		});

		const submitData = await submitRes.json();
		results.push({ clueId: clue2.id, answer: answer2, correct: submitData.correct });

		expect(submitData.correct).toBe(true);
		expect(submitData.nextClue).toBeDefined();
	});

	it('should solve clue 3: calculate ratio and round down', async () => {
		// Re-submit clues 1 and 2 to get clue 3
		const charactersRes = await fetch(`${RICK_MORTY_API_BASE}/character/?status=alive`);
		const charactersData = await charactersRes.json();
		const answer1 = charactersData.results.length.toString();

		await fetch(`${BASE_URL}/submit`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				mysteryId: mystery.mysteryId,
				clueId: mystery.currentClue.id,
				answer: answer1
			})
		});

		const rickRes = await fetch(`${RICK_MORTY_API_BASE}/character/1`);
		const rickData = await rickRes.json();
		const answer2 = rickData.episode.length.toString();

		const clue1Res = await fetch(`${BASE_URL}/submit`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				mysteryId: mystery.mysteryId,
				clueId: mystery.currentClue.id,
				answer: answer1
			})
		});
		const clue1Data = await clue1Res.json();

		const clue2Res = await fetch(`${BASE_URL}/submit`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				mysteryId: mystery.mysteryId,
				clueId: clue1Data.nextClue.id,
				answer: answer2
			})
		});
		const clue2Data = await clue2Res.json();
		const clue3 = clue2Data.nextClue;

		expect(clue3).toBeDefined();

		// Calculate: floor(episode_count / first_page_count)
		const episodeCount = parseInt(answer2);
		const firstPageCount = parseInt(answer1);
		const ratio = Math.floor(episodeCount / firstPageCount);
		const answer3 = ratio.toString();

		// Submit final answer
		const submitRes = await fetch(`${BASE_URL}/submit`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				mysteryId: mystery.mysteryId,
				clueId: clue3.id,
				answer: answer3
			})
		});

		const submitData = await submitRes.json();
		results.push({ clueId: clue3.id, answer: answer3, correct: submitData.correct });

		expect(submitData.correct).toBe(true);
		expect(submitData.mysterySolved).toBe(true);
		expect(submitData.conclusion).toBeDefined();
	});

	it('should have all clues marked as correct', () => {
		expect(results.length).toBe(3);
		expect(results.every((r) => r.correct)).toBe(true);
	});
});
