/**
 * Unit Tests for Mystery 002: The Dog Breed Mystery
 */

import { describe, it, expect, beforeAll } from 'bun:test';
import app from '../src/routes/[...slugs]/index.ts';
import { getMystery, submitAnswer, submitFinalAnswer } from './utils.ts';

const DOG_API_BASE = 'https://dog.ceo/api';

describe.serial('Mystery 002: The Dog Breed Mystery', async () => {
	let mystery = await getMystery('myst_002');
	let currentClue = mystery.currentClue.id;

	it('should solve clue 1: count hound sub-breeds', async () => {
		const breedsRes = await fetch(`${DOG_API_BASE}/breeds/list/all`);
		const breedsData = await breedsRes.json();

		expect(breedsData.message.hound).toBeDefined();
		const houndSubBreeds = breedsData.message.hound;
		expect(Array.isArray(houndSubBreeds)).toBe(true);

		const answer = houndSubBreeds.length.toString();
		currentClue = await submitAnswer(mystery.mysteryId, currentClue, answer);
	});

	it('should solve clue 2: find first hound sub-breed alphabetically', async () => {
		// Get hound sub-breeds again
		const breedsRes = await fetch(`${DOG_API_BASE}/breeds/list/all`);
		const breedsData = await breedsRes.json();
		const houndSubBreeds = breedsData.message.hound;

		// Sort and get first alphabetically
		const sortedHounds = [...houndSubBreeds].sort();
		const answer = sortedHounds[0];
		currentClue = await submitAnswer(mystery.mysteryId, currentClue, answer);
	});

	it('should solve clue 3: count letters in the breed name', async () => {
		// Get hound sub-breeds
		const breedsRes = await fetch(`${DOG_API_BASE}/breeds/list/all`);
		const breedsData = await breedsRes.json();
		const houndSubBreeds = breedsData.message.hound;
		const sortedHounds = [...houndSubBreeds].sort();

		// Calculate length of breed name
		const answer = sortedHounds[0].length.toString();
		await submitFinalAnswer(mystery.mysteryId, currentClue, answer);
	});
});
