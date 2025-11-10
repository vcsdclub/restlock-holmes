import { Elysia, t } from 'elysia';
import { openapi } from '@elysiajs/openapi';
import { store } from './store';
import type { Mystery, Hint, ApiError, SubmitResponse } from './types';
function toCode(strings: TemplateStringsArray): string[] {
	const str = strings[0];
	const lines = str.split('\n');
	const length = Math.max(...lines.map((line) => line.length));
	return lines.map((line) => line.padEnd(length));
}
export default new Elysia()
	.use(
		openapi({
			documentation: {
				info: {
					title: 'RESTlock Holmes API',
					version: '1.0.0',
					description: `# Welcome to RESTlock Holmes!

An educational escape room API that teaches developers how to read documentation and work with APIs through puzzle-solving.

## How It Works

RESTlock Holmes presents you with mystery cases. Each mystery contains a chain of clues that require you to:
1. Read and understand the clue description
2. Query external public APIs (like PokeAPI, Dog CEO, REST Countries, etc.)
3. Process the API responses to find specific information
4. Submit your answer to unlock the next clue

## Getting Started

**Quick Start:**
1. GET \`/mystery\` to receive your first case
2. Read the \`firstClue.text\` and \`apiHint\`
3. Query the suggested external API to find the answer
4. POST \`/submit\` with your answer
6. Your next clue will be in the \`nextclue\` of the response
5. Repeat until \`mysterySolved: true\`

**Need help?** Use GET \`/hint\` to get progressive hints for any clue.

## Difficulty Levels

- **Easy:** Simple API queries with straightforward data extraction
- **Medium:** Requires data processing, filtering, or calculations
- **Hard:** Multi-step logic, complex data transformations, or multiple API calls

## Learning Objectives

This API teaches you:
- How to read and understand API documentation
- Making HTTP requests and handling responses
- Working with JSON data structures
- Data processing and transformation
- Error handling and debugging API calls
- Progressive problem-solving strategies`,
					contact: {
						name: 'RESTlock Holmes',
						url: 'https://github.com/vcsdclub/restlock-holmes'
					},
					license: {
						name: 'MIT',
						url: 'https://opensource.org/licenses/MIT'
					}
				},
				servers: [
					{
						url: 'https://restlock-holmes.vercel.app',
						description: 'Production server'
					}
				],
				tags: [
					{
						name: 'Game',
						description:
							'Core game mechanics for mystery solving. These endpoints handle the complete game flow from starting a mystery to solving clues and receiving hints.',
						externalDocs: {
							description: 'View example solutions',
							url: 'https://github.com/vcsdclub/restlock-holmes/tree/main/tests'
						}
					}
				],
				externalDocs: {
					description: 'Full documentation and setup guide',
					url: 'https://github.com/vcsdclub/restlock-holmes'
				}
			}
		})
	)

	// GET /mystery - Get a new mystery to solve
	.get(
		'/mystery',
		({ query, set }) => {
			try {
				const { difficulty, mysteryId } = query;

				// Validate difficulty if provided
				if (difficulty && !['easy', 'medium', 'hard'].includes(difficulty)) {
					set.status = 400;
					return {
						error: 'InvalidDifficulty',
						message: "Difficulty must be 'easy', 'medium', or 'hard'"
					} satisfies ApiError;
				}

				// Get a mystery (by ID if specified, otherwise random)
				const mystery = store.getRandomMystery(
					difficulty as 'easy' | 'medium' | 'hard' | undefined,
					mysteryId
				);

				return mystery satisfies Mystery;
			} catch (error) {
				set.status = 404;
				return {
					error: 'MysteryNotFound',
					message: error instanceof Error ? error.message : 'Failed to retrieve mystery'
				} satisfies ApiError;
			}
		},
		{
			detail: {
				tags: ['Game'],
				summary: 'Get a new mystery to solve',
				description: `Retrieves a mystery case with clues that point to external APIs. Each mystery requires reading API documentation and writing code to solve.

**How it works:**
- Without parameters: Returns a random mystery from all difficulties
- With difficulty: Returns a random mystery of the specified difficulty level
- With mysteryId: Returns a specific mystery (useful for replaying or testing)

**Response includes:**
- Mystery metadata (ID, title, difficulty, scenario)
- Current clue to solve (first clue in the chain)
- Progress tracking (current clue index and total clues)
- Number of hints available for the current clue

**Workflow:**
1. Call this endpoint to start a new mystery
2. Save the \`mysteryId\` and \`firstClue.id\` - you'll need them for subsequent requests
3. Read the \`firstClue.text\` and \`apiHint\` to understand what to find
4. Use external APIs to gather data and determine your answer
5. Submit your answer via POST /submit`,
				externalDocs: {
					description: 'Learn more about solving mysteries',
					url: 'https://github.com/vcsdclub/restlock-holmes?tab=readme-ov-file#example-mystery'
				}
			},
			query: t.Object({
				difficulty: t.Optional(
					t.Union([t.Literal('easy'), t.Literal('medium'), t.Literal('hard')], {
						description:
							'Filter mysteries by difficulty level. Easy mysteries involve simple API calls, medium require data processing, hard involve complex multi-step logic.'
					})
				),
				mysteryId: t.Optional(
					t.String({
						description:
							'Request a specific mystery by ID. Useful for replaying mysteries or testing solutions.'
					})
				)
			}),
			response: {
				200: t.Object(
					{
						mysteryId: t.String({ description: 'Unique identifier for this mystery instance' }),
						title: t.String({ description: 'The name of the mystery case' }),
						difficulty: t.Union([t.Literal('easy'), t.Literal('medium'), t.Literal('hard')], {
							description: 'Difficulty level of this mystery'
						}),
						scenario: t.String({ description: 'Background story and context for the mystery' }),
						firstClue: t.Object({
							id: t.String({ description: 'Unique identifier for this clue' }),
							text: t.String({ description: 'The clue text describing what you need to find' }),
							apiHint: t.String({ description: 'Hint about which external API to use' }),
							hintsAvailable: t.Number({ description: 'Number of hints available for this clue' })
						}),
						// firstClueIndex: t.Number({ description: 'Zero-based index of the current clue' }),
						totalClues: t.Number({ description: 'Total number of clues in this mystery' }),
						createdAt: t.String({
							description: 'ISO 8601 timestamp of when this mystery was created'
						})
					},
					{
						description: 'A mystery case with the first clue to solve',
						examples: [
							{
								mysteryId: 'mystery-1234567890',
								title: 'The Case of the Missing Pokemon',
								difficulty: 'easy',
								scenario:
									"A rare Pokemon has gone missing from Professor Oak's lab. Use your API skills to track it down!",
								firstClue: {
									id: 'clue-1',
									text: 'Find out how many game appearances Pikachu has made',
									apiHint: 'Try the PokeAPI at pokeapi.co',
									hintsAvailable: 3
								},
								totalClues: 3,
								createdAt: '2025-11-01T12:00:00.000Z'
							}
						]
					}
				),
				400: t.Object(
					{
						error: t.String(),
						message: t.String()
					},
					{
						description: 'Invalid difficulty parameter',
						examples: [
							{
								error: 'InvalidDifficulty',
								message: "Difficulty must be 'easy', 'medium', or 'hard'"
							}
						]
					}
				),
				404: t.Object(
					{
						error: t.String(),
						message: t.String()
					},
					{
						description: 'Mystery not found (when mysteryId is specified)',
						examples: [
							{
								error: 'MysteryNotFound',
								message: 'No mystery found with ID: mystery-12345'
							}
						]
					}
				)
			}
		}
	)

	// GET /hint - Get a hint for a specific clue
	.get(
		'/hint',
		({ query, set }) => {
			const { mysteryId, clueId, index } = query;

			if (!mysteryId || !clueId) {
				set.status = 400;
				return {
					error: 'MissingParameter',
					message: 'mysteryId and clueId are required'
				} satisfies ApiError;
			}

			// Get hint by index (first hint if no index provided)
			const hint = store.getHintByIndex(mysteryId, clueId, index);

			if (!hint) {
				set.status = 404;
				return {
					error: 'ClueNotFound',
					message: 'The specified clue could not be found or has no hints available'
				} satisfies ApiError;
			}

			return {
				mysteryId,
				clueId,
				hint
			} satisfies Hint;
		},
		{
			detail: {
				tags: ['Game'],
				summary: 'Get a hint for the current clue',
				description: `Retrieves a hint to help solve the current clue. Hints are provided sequentially and become progressively more helpful.

**How hints work:**
- Hints are indexed starting at 0
- Omit the \`index\` parameter to get the first hint (index 0)
- Each clue has a different number of hints available (check \`hintsAvailable\` in the clue)
- Requesting an index beyond available hints returns "No more hints."
- Hints are unlimited - use as many as you need without penalty

**Strategy:**
- First hint: Usually points you to the right API endpoint or data structure
- Middle hints: Help with data processing or transformation logic
- Final hints: Provide nearly complete guidance, stopping short of the exact answer

**Example usage:**
1. GET /hint?mysteryId=X&clueId=Y (gets first hint)
2. GET /hint?mysteryId=X&clueId=Y&index=1 (gets second hint)
3. Continue incrementing index until you get "No more hints."`
			},
			query: t.Object({
				mysteryId: t.String({ description: 'The mystery ID from GET /mystery' }),
				clueId: t.String({ description: 'The clue ID from the current clue' }),
				index: t.Optional(
					t.Numeric({ description: 'Zero-based hint index. Omit to get the first hint (index 0)' })
				)
			}),
			response: {
				200: t.Object(
					{
						mysteryId: t.String({ description: 'The mystery ID' }),
						clueId: t.String({ description: 'The clue ID' }),
						hint: t.String({
							description: 'The hint text, or "No more hints." if index is out of bounds'
						})
					},
					{
						description: 'A hint for the specified clue',
						examples: [
							{
								mysteryId: 'mystery-1234567890',
								clueId: 'clue-1',
								hint: 'Try querying the PokeAPI endpoint for Pikachu: https://pokeapi.co/api/v2/pokemon/pikachu'
							},
							{
								mysteryId: 'mystery-1234567890',
								clueId: 'clue-1',
								hint: 'No more hints.'
							}
						]
					}
				),
				400: t.Object(
					{
						error: t.String(),
						message: t.String()
					},
					{
						description: 'Missing required parameters',
						examples: [
							{
								error: 'MissingParameter',
								message: 'mysteryId and clueId are required'
							}
						]
					}
				),
				404: t.Object(
					{
						error: t.String(),
						message: t.String()
					},
					{
						description: 'Clue not found or has no hints available',
						examples: [
							{
								error: 'ClueNotFound',
								message: 'The specified clue could not be found or has no hints available'
							}
						]
					}
				)
			}
		}
	)

	// POST /submit - Submit an answer to a clue
	.post(
		'/submit',
		({ body, set }) => {
			const { mysteryId, clueId, answer } = body;

			if (!mysteryId || !clueId || answer === undefined) {
				set.status = 400;
				return {
					error: 'InvalidRequest',
					message: 'mysteryId, clueId, and answer are required'
				} satisfies ApiError;
			}

			// Check if mystery and clue exist
			if (!store.getMysteryById(mysteryId)) {
				set.status = 404;
				return {
					error: 'MysteryNotFound',
					message: 'The specified mystery could not be found'
				} satisfies ApiError;
			}

			if (!store.getClueById(mysteryId, clueId)) {
				set.status = 404;
				return {
					error: 'ClueNotFound',
					message: 'The specified clue could not be found'
				} satisfies ApiError;
			}

			// Check answer
			const isCorrect = store.checkAnswer(mysteryId, clueId, answer);

			if (isCorrect) {
				// Check if this is the last clue
				const isLast = store.isLastClue(mysteryId, clueId);

				if (isLast) {
					// Mystery solved!
					const conclusion = store.getConclusion(mysteryId);
					return {
						correct: true,
						message: "Correct! You've solved the entire mystery!",
						mysteryId,
						mysterySolved: true,
						conclusion: conclusion || 'Congratulations on solving the mystery!'
					} satisfies SubmitResponse;
				} else {
					// If you're not last, there is always a next clue
					const nextClue = store.getNextClue(mysteryId, clueId)!;
					return {
						correct: true,
						message: "Correct! Here's your next clue...",
						mysteryId,
						nextClue,
						mysterySolved: false
					} satisfies SubmitResponse;
				}
			} else {
				return {
					correct: false,
					message: 'Not quite right. Try again, or request a hint!',
					mysteryId,
					mysterySolved: false
				} satisfies SubmitResponse;
			}
		},
		{
			detail: {
				tags: ['Game'],
				summary: 'Submit an answer to a clue',
				description: `Submit your answer to the current clue. The API validates your answer and progresses you through the mystery chain.

**Response behavior:**
- **Correct answer, more clues remaining:** Returns \`nextClue\` object with the next challenge
- **Correct answer, final clue:** Returns \`conclusion\` with the mystery resolution and \`mysterySolved: true\`
- **Incorrect answer:** Returns \`correct: false\` with an encouraging message to try again

**Answer format:**
- Answers are case-insensitive (e.g., "Pikachu", "pikachu", and "PIKACHU" are all equivalent)
- Whitespace is trimmed automatically
- Submit answers as strings, even if they're numbers (e.g., "42" not 42)

**Workflow:**
1. Get a mystery and extract mysteryId and clueId
2. Solve the clue by querying external APIs
3. Submit your answer to this endpoint
4. If correct, save the new \`nextClue\` and continue with the next clue
5. Repeat until mysterySolved is true`
			},
			body: t.Object(
				{
					mysteryId: t.String({ description: 'The mystery ID from GET /mystery' }),
					clueId: t.String({ description: 'The current clue ID you are answering' }),
					answer: t.String({ description: 'Your answer as a string (case-insensitive)' })
				},
				{
					examples: [
						{
							mysteryId: 'mystery-1234567890',
							clueId: 'clue-1',
							answer: '42'
						}
					]
				}
			),
			response: {
				// XXX: the issue is that we have multiple different possible outputs with wildly
				// different schemas all under 200. Scalar doesn't really support this well
				// so one option could be (incorrectly) documenting them as separate
				// HTTP response codes (but still under 2xx) or keep it as how it is currently
				// (a scuffed union that Scalar doesn't really support)
				200: t.Union(
					[
						// Correct answer with next clue
						t.Object({
							correct: t.Literal(true, { description: 'Answer was correct' }),
							message: t.String({ description: 'Success message' }),
							mysteryId: t.String({ description: 'The mystery ID' }),
							mysterySolved: t.Literal(false, { description: 'Mystery is not yet complete' }),
							nextClue: t.Object({
								id: t.String({ description: 'ID of the next clue' }),
								text: t.String({ description: 'The next clue text' }),
								apiHint: t.String({ description: 'Hint about which API to use' }),
								hintsAvailable: t.Number({ description: 'Number of hints for the next clue' })
							})
						}),
						// Correct answer, mystery solved
						t.Object({
							correct: t.Literal(true, { description: 'Answer was correct' }),
							message: t.String({ description: 'Success message' }),
							mysteryId: t.String({ description: 'The mystery ID' }),
							mysterySolved: t.Literal(true, { description: 'Mystery has been solved' }),
							conclusion: t.String({ description: 'The mystery conclusion and resolution' })
						}),
						// Incorrect answer
						t.Object({
							correct: t.Literal(false, { description: 'Answer was incorrect' }),
							message: t.String({ description: 'Encouragement message' }),
							mysteryId: t.String({ description: 'The mystery ID' }),
							mysterySolved: t.Literal(false, { description: 'Mystery is not solved yet' })
						})
					],
					{
						description:
							'Response varies based on answer correctness and mystery progress. Click on "Show Schema" to see examples for all cases',
						examples: [
							{
								correct: true,
								message: "Correct! Here's your next clue...",
								mysteryId: 'mystery-1234567890',
								clueId: 'clue-1',
								mysterySolved: false,
								nextClue: {
									id: 'clue-2',
									text: 'What is the height of Charizard in decimeters?',
									apiHint: 'PokeAPI has this information',
									hintsAvailable: 2
								}
							},
							{
								correct: true,
								message: "Correct! You've solved the entire mystery!",
								mysteryId: 'mystery-1234567890',
								clueId: 'clue-3',
								mysterySolved: true,
								conclusion:
									'Excellent detective work! You successfully tracked down the missing Pokemon using your API investigation skills.'
							},
							{
								correct: false,
								message: 'Not quite right. Try again, or request a hint!',
								mysteryId: 'mystery-1234567890',
								clueId: 'clue-1',
								mysterySolved: false
							}
						]
					}
				),
				400: t.Object(
					{
						error: t.String(),
						message: t.String()
					},
					{
						description: 'Missing required parameters',
						examples: [
							{
								error: 'InvalidRequest',
								message: 'mysteryId, clueId, and answer are required'
							}
						]
					}
				),
				404: t.Object(
					{
						error: t.String(),
						message: t.String()
					},
					{
						description: 'Mystery or clue not found',
						examples: [
							{
								error: 'MysteryNotFound',
								message: 'The specified mystery could not be found'
							},
							{
								error: 'ClueNotFound',
								message: 'The specified clue could not be found'
							}
						]
					}
				)
			}
		}
	)

	// Root endpoint
	.get(
		'/',
		() => ({
			message: 'Welcome to RESTlock Holmes!',
			tagline: 'Learn APIs by solving mysteries with code!',

			howToPlay: [
				'1. Get a mystery: GET /mystery',
				'2. Read the clue and use external APIs to find the answer',
				'3. Submit your answer: POST /submit',
				'4. If correct, get the next clue. If stuck, get a hint!',
				'5. Solve all clues to complete the mystery',
				'Check out the documentation for more details (at /openapi)'
			],
			fetchApiTutorial: {
				title: 'Using the Fetch API',
				description: "Here's how to solve mysteries using JavaScript's fetch API",

				steps: [
					{
						description: 'Step 1: Get a mystery to solve',
						code: toCode`// Get a random mystery
const response = await fetch('https://restlock-holmes.vercel.app/mystery');
const mystery = await response.json();

console.log(mystery.title);
console.log(mystery.firstClue.text);
// Save mysteryId and clueId - you'll need them!`
					},

					{
						description: 'Step 2: Use external APIs to find the answer',
						code: toCode`// Example: Using PokeAPI to find information
const pokeResponse = await fetch('https://pokeapi.co/api/v2/pokemon/pikachu');
const pokeData = await pokeResponse.json();

// Process the data to find your answer
const answer = pokeData.game_indices.length.toString();
console.log('My answer:', answer);`
					},

					{
						description: 'Step 3: Submit your answer',
						code: toCode`// Submit your answer
const submitResponse = await fetch('https://restlock-holmes.vercel.app/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    mysteryId: mystery.mysteryId,
    clueId: mystery.firstClue.id,
    answer: answer
  })
});

const result = await submitResponse.json();
console.log(result.message);

if (result.correct && result.nextClue) {
  console.log('Next clue:', result.nextClue.text);
} else if (result.mysterySolved) {
  console.log('Mystery solved!', result.conclusion);
}`
					},
					{
						description: "Optional: Get a hint if you're stuck",
						code: toCode`// Get the first hint (no index parameter)
const hintResponse = await fetch(
  \`https://restlock-holmes.vercel.app/hint?mysteryId=\${mystery.mysteryId}&clueId=\${mystery.firstClue.id}\`
);
const hintData = await hintResponse.json();
console.log('Hint:', hintData.hint);

// Get a specific hint by index (e.g., second hint)
const hint2Response = await fetch(
  \`https://restlock-holmes.vercel.app/hint?mysteryId=\${mystery.mysteryId}&clueId=\${mystery.firstClue.id}&index=1\`
);
const hint2Data = await hint2Response.json();
console.log('Hint 2:', hint2Data.hint);`
					}
				],

				fullExample: {
					description: 'Complete example: Solving a mystery',
					code: toCode`async function solveMystery() {
  // 1. Get mystery
  const mystery = await fetch('https://restlock-holmes.vercel.app/mystery')
    .then(r => r.json());

  console.log('Mystery:', mystery.title);
  console.log('Clue:', mystery.firstClue.text);

  // 2. Use the clue's apiHint to figure out which external API to use
  console.log('API Hint:', mystery.firstClue.apiHint);

  // 3. Query external API (example with Dog API)
  const dogData = await fetch('https://dog.ceo/api/breeds/list/all')
    .then(r => r.json());

  // 4. Process data to find answer
  const answer = dogData.message.hound.length.toString();

  // 5. Submit answer
  const result = await fetch('https://restlock-holmes.vercel.app/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mysteryId: mystery.mysteryId,
      clueId: mystery.firstClue.id,
      answer: answer
    })
  }).then(r => r.json());

  console.log(result.message);
  return result;
}

solveMystery();`
				}
			},

			tips: [
				'Read the clue carefully - it tells you exactly what to find',
				'Use the apiHint to know which external API to query',
				'Process the API response to extract the specific data you need',
				'Answers are case-insensitive strings',
				'Each clue has multiple hints - use GET /hint to get hints sequentially',
				'Hints are indexed starting at 0. Omit the index to get the first hint',
				"When you run out of hints, the API will return 'No more hints.'",
				'Check the /openapi docs for full API reference'
			]

			// resources: {
			//   documentation: "See /openapi",
			//   exampleSolutions: "See /tests directory for complete solutions",
			//   mysteryGuide: "See /docs/README.md for creating mysteries",
			// },
		}),
		{
			detail: {
				hide: true
			}
		}
	);
