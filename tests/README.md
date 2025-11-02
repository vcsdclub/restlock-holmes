# Mystery Tests / Example Solutions

This directory contains test files that also serve as example solutions for each mystery. Yes, that means we're only testing happy paths here.

## Running Tests

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

## Writing New Tests

When adding a new mystery to `mysteries.yaml`, create a corresponding test file:

1. Copy an existing test file (e.g., `myst_001_solution.ts`)
2. Rename it to match your mystery ID (e.g., `myst_004_solution.ts`)
3. Update the solution logic for each clue

This ensures every mystery has a verified working solution!
