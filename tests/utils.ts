// Utilities making the test writing simpler and thus
// more readable as solutions

import { expect } from 'bun:test';
import app from '../src/routes/[...slugs]/index.ts';

import { treaty } from '@elysiajs/eden';

const api = treaty(app);

export async function getMystery(mysteryId: string) {
	const mystery = (await api.mystery.get({ query: { mysteryId } })).data!;
	expect(mystery).not.toBeNull();
	expect(mystery.mysteryId).toBe(mysteryId);
	expect(mystery.title).toBeDefined();
	expect(mystery.scenario).toBeDefined();
	expect(mystery.currentClue).toBeDefined();
	return mystery as NonNullable<typeof mystery>;
}

export async function submitFinalAnswer(mysteryId: string, clueId: string, answer: string) {
	const submitRes = await (
		await app.handle(
			new Request('http://localhost/submit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					mysteryId,
					clueId,
					answer
				})
			})
		)
	).json();
	expect(submitRes.correct).toBe(true);
	expect(submitRes.mysterySolved).toBe(true);
	expect(submitRes.conclusion).toBeDefined();
}

export async function submitAnswer(mysteryId: string, clueId: string, answer: string) {
	const submitRes = await (
		await app.handle(
			new Request('http://localhost/submit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					mysteryId,
					clueId,
					answer
				})
			})
		)
	).json();

	expect(submitRes.correct).toBe(true);
	expect(submitRes.mysterySolved).toBe(false);
	expect(submitRes.nextClue).toBeDefined();
	return submitRes.nextClue.id;
}
