/**
 * Unit Tests for Mystery 003: The JSONPlaceholder Puzzle
 */

import { describe, it, expect } from 'bun:test';
import { getMystery, submitAnswer, submitFinalAnswer } from './utils.ts';

const JSON_API_BASE = 'https://jsonplaceholder.typicode.com';

describe.serial('Mystery 003: The JSONPlaceholder Puzzle', async () => {
	let mystery = await getMystery('myst_003');
	let currentClue = mystery.currentClue.id;

	it('should solve clue 1: get userId from post #50', async () => {
		const postRes = await fetch(`${JSON_API_BASE}/posts/50`);
		const postData = await postRes.json();

		expect(postData).toBeDefined();
		expect(postData.userId).toBeDefined();

		const answer = postData.userId.toString();
		currentClue = await submitAnswer(mystery.mysteryId, currentClue, answer);
	});

	it('should solve clue 2: get first name of user #5', async () => {
		// Get user #5 data
		const userRes = await fetch(`${JSON_API_BASE}/users/5`);
		const userData = await userRes.json();

		expect(userData).toBeDefined();
		expect(userData.name).toBeDefined();

		const fullName = userData.name;
		const firstName = fullName.split(' ')[0];

		const answer = firstName;
		currentClue = await submitAnswer(mystery.mysteryId, currentClue, answer);
	});

	it('should solve clue 3: count letters in first name', async () => {
		// Get user #5 data again
		const userRes = await fetch(`${JSON_API_BASE}/users/5`);
		const userData = await userRes.json();
		const fullName = userData.name;
		const firstName = fullName.split(' ')[0];

		// Calculate length of first name
		const answer = firstName.length.toString();
		await submitFinalAnswer(mystery.mysteryId, currentClue, answer);
	});
});
