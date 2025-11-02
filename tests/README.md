# Mystery Tests / Example Solutions

This directory contains test files that also serve as example solutions for each mystery.

## Running Tests

Make sure the server is running first:

```bash
bun run dev
```

Then in another terminal, run the tests:

```bash
# Run all mystery tests
bun test
```

## Test Files

Each test file demonstrates the complete solution for a mystery.

## How Tests Work

Each test file:

1. Fetches the mystery from the API
2. Solves each clue step-by-step by calling external APIs
3. Submits answers to verify correctness
4. Logs the solution process with detailed output
5. Exits with code 0 if all clues are solved correctly

## Example Output

```
🔍 Starting Mystery 001: The Evolved Enigma

📖 Mystery: The Evolved Enigma
📝 Scenario: A mysterious trainer left behind cryptic notes...

--- Clue 1 ---
First, find all rock-type Pokémon and locate the one whose name ends in 'dore'...
💡 Answer: boldore
✅ Correct! Here's your next clue...

--- Clue 2 ---
Excellent! Now get Boldore's details and find the number of game versions...
💡 Answer: 14
✅ Correct! Here's your next clue...

--- Clue 3 ---
Perfect! Now take that number (14) and multiply it by Boldore's base HP stat...
💡 Answer: 350 (14 × 25)
✅ Correct! You've solved the entire mystery!

🎉 Incredible work, detective! You've cracked the trainer's code...

📊 Results:
  ✅ clue_001: boldore
  ✅ clue_002: 14
  ✅ clue_003: 350
```

## Writing New Tests

When adding a new mystery to `mysteries.yaml`, create a corresponding test file:

1. Copy an existing test file (e.g., `myst_001_solution.ts`)
2. Rename it to match your mystery ID (e.g., `myst_004_solution.ts`)
3. Update the solution logic for each clue
4. Add the test script to `package.json`
5. Add it to `run-all.ts`

This ensures every mystery has a verified working solution!
