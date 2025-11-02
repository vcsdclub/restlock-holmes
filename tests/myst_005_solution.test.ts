/**
 * Vitest Unit Tests for Mystery 005: The Continental Capitals
 */

import { describe, it, expect, beforeAll } from 'vitest';

const BASE_URL = 'http://localhost:5173';
const REST_COUNTRIES_API_BASE = 'https://restcountries.com/v3.1';

interface TestResult {
	clueId: string;
	answer: string;
	correct: boolean;
}

describe('Mystery 005: The Continental Capitals', () => {
	let mystery: any;
	const results: TestResult[] = [];

	beforeAll(async () => {
		// Get the mystery
		const mysteryRes = await fetch(`${BASE_URL}/mystery?mysteryId=myst_005`);
		const mysteryData = await mysteryRes.json();
		mystery = mysteryData;
	});

	it('should fetch the correct mystery (myst_005)', () => {
		expect(mystery).toBeDefined();
		expect(mystery.mysteryId).toBe('myst_005');
		expect(mystery.title).toBeDefined();
		expect(mystery.scenario).toBeDefined();
		expect(mystery.currentClue).toBeDefined();
	});

	it('should solve clue 1: find Germany capital', async () => {
		const countryRes = await fetch(`${REST_COUNTRIES_API_BASE}/alpha/DE`);
		const countryData = await countryRes.json();

		expect(countryData).toBeDefined();
		expect(Array.isArray(countryData)).toBe(true);
		expect(countryData[0].capital).toBeDefined();

		const answer1 = countryData[0].capital[0];

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

	it('should solve clue 2: count letters in Berlin', async () => {
		// Re-submit clue 1 to get clue 2
		const countryRes = await fetch(`${REST_COUNTRIES_API_BASE}/alpha/DE`);
		const countryData = await countryRes.json();
		const answer1 = countryData[0].capital[0];

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

		// Count letters in the capital
		const answer2 = answer1.length.toString();

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

	it('should solve clue 3: calculate population in millions', async () => {
		// Re-submit clues 1 and 2 to get clue 3
		const countryRes = await fetch(`${REST_COUNTRIES_API_BASE}/alpha/DE`);
		const countryData = await countryRes.json();
		const answer1 = countryData[0].capital[0];
		const answer2 = answer1.length.toString();

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

		// Get population and calculate
		const population = countryData[0].population;
		const populationInMillions = Math.floor(population / 1000000);
		const answer3 = populationInMillions.toString();

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
