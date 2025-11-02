/**
 * Vitest Unit Tests for Mystery 006: The Random Identity Generator
 */

import { describe, it, expect, beforeAll } from 'vitest';

const BASE_URL = 'http://localhost:5173';
const RANDOM_USER_API_BASE = 'https://randomuser.me/api';

interface TestResult {
	clueId: string;
	answer: string;
	correct: boolean;
}

describe('Mystery 006: The Random Identity Generator', () => {
	let mystery: any;
	const results: TestResult[] = [];

	beforeAll(async () => {
		// Get the mystery
		const mysteryRes = await fetch(`${BASE_URL}/mystery?mysteryId=myst_006`);
		const mysteryData = await mysteryRes.json();
		mystery = mysteryData;
	});

	it('should fetch the correct mystery (myst_006)', () => {
		expect(mystery).toBeDefined();
		expect(mystery.mysteryId).toBe('myst_006');
		expect(mystery.title).toBeDefined();
		expect(mystery.scenario).toBeDefined();
		expect(mystery.currentClue).toBeDefined();
	});

	it('should solve clue 1: get gender from seeded user', async () => {
		const userRes = await fetch(`${RANDOM_USER_API_BASE}/?seed=mystery006`);
		const userData = await userRes.json();

		expect(userData).toBeDefined();
		expect(userData.results).toBeDefined();
		expect(Array.isArray(userData.results)).toBe(true);
		expect(userData.results.length).toBeGreaterThan(0);

		const user = userData.results[0];
		const answer1 = user.gender;

		expect(['male', 'female'].includes(answer1)).toBe(true);

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

	it('should solve clue 2: get nationality code', async () => {
		// Re-submit clue 1 to get clue 2
		const userRes = await fetch(`${RANDOM_USER_API_BASE}/?seed=mystery006`);
		const userData = await userRes.json();
		const user = userData.results[0];
		const answer1 = user.gender;

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

		// Get nationality
		const answer2 = user.nat;
		expect(answer2).toBeDefined();
		expect(typeof answer2).toBe('string');

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

	it('should solve clue 3: count letters in full name', async () => {
		// Re-submit clues 1 and 2 to get clue 3
		const userRes = await fetch(`${RANDOM_USER_API_BASE}/?seed=mystery006`);
		const userData = await userRes.json();
		const user = userData.results[0];
		const answer1 = user.gender;
		const answer2 = user.nat;

		await fetch(`${BASE_URL}/submit`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				mysteryId: mystery.mysteryId,
				clueId: mystery.currentClue.id,
				answer: answer1
			})
		});

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

		// Calculate name length without spaces
		const firstName = user.name.first;
		const lastName = user.name.last;
		const fullName = firstName + lastName;
		const answer3 = fullName.length.toString();

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
