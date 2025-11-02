/**
 * Vitest Unit Tests for Mystery 001: The Evolved Enigma
 */

import { describe, it, expect, beforeAll, beforeEach } from 'bun:test';
import { getMystery, submitAnswer, submitFinalAnswer } from './utils';

const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

describe.serial('Mystery 001: The Evolved Enigma', async () => {
	let mystery = await getMystery('myst_001');
	let currentClue = mystery.firstClue.id;

	it('should solve clue 1: find rock-type Pokemon ending in "dore" with 7 letters', async () => {
		// Fetch rock-type Pokemon
		const rockTypeRes = await fetch(`${POKEAPI_BASE}/type/rock`);
		const rockTypeData = await rockTypeRes.json();

		// Find Pokemon ending in 'dore' with 7 letters
		const rockPokemon = rockTypeData.pokemon.map((p: any) => p.pokemon.name);
		const dorePokemons = rockPokemon.filter(
			(name: string) => name.endsWith('dore') && name.length === 7
		);

		const answer = dorePokemons[0];
		currentClue = await submitAnswer(mystery.mysteryId, currentClue, answer);
	});

	it('should solve clue 2: count game_indices for Boldore', async () => {
		// Get Boldore details
		const boldoreRes = await fetch(`${POKEAPI_BASE}/pokemon/boldore`);
		const boldoreData = await boldoreRes.json();

		// Count game_indices
		const gameIndicesCount = boldoreData.game_indices.length;

		const answer = gameIndicesCount.toString();
		currentClue = await submitAnswer(mystery.mysteryId, currentClue, answer);
	});

	it('should solve clue 3: multiply game_indices count by HP stat', async () => {
		// Get Boldore data
		const boldoreRes = await fetch(`${POKEAPI_BASE}/pokemon/boldore`);
		const boldoreData = await boldoreRes.json();
		const gameIndicesCount = boldoreData.game_indices.length;

		// Find HP stat
		const hpStat = boldoreData.stats.find((s: any) => s.stat.name === 'hp');
		const hpValue = hpStat.base_stat;

		expect(hpValue).toBeGreaterThan(0);

		// Multiply game indices count by HP
		const finalAnswer = (gameIndicesCount * hpValue).toString();

		await submitFinalAnswer(mystery.mysteryId, currentClue, finalAnswer);
	});
});
