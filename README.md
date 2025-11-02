# RESTlock Holmes 🔍

*Elementary, my dear developer—the game is afoot!*

Learn APIs the fun way: by solving mysteries with code. RESTlock Holmes is an interactive puzzle game where you play detective, using real APIs to crack cases and uncover clues.

## What Is This?

RESTlock Holmes is an educational escape room built with [Elysia](https://elysiajs.com/) that teaches you API skills through mystery-solving. Instead of boring tutorials, you'll learn by doing: reading real documentation, making API calls, and processing data to solve puzzles that can't just be simply Googled.

## How It Works

You're given mystery cases with clues that hint at external APIs. To crack each case:

1. **Think** - Figure out which API endpoint you need
2. **Read the docs** — Read the documentation for the API you need
3. **Write code** — Query the API with the right parameters
4. **Process the data** — Extract and calculate your answer programmatically

No shortcuts: answers are designed to be impossible to Google. You *must* write code to solve them.

## Example Mystery

**Clue:** *"Find the second evolution of a rock-type Pokémon whose name ends in 'dore'. Your answer is the sum of all game_indices for this Pokémon."*

**Why you can't just Google this:**
- The answer requires filtering hundreds of Pokémon
- You need to chain multiple API calls
- The final answer is a calculated value, not something you can look up

**What you'll need to do to crack the clue:**
1. Read the [PokéAPI docs](https://pokeapi.co/docs/v2)
2. Filter rock-type Pokémon programmatically
3. Find the right evolution chain
4. Fetch that Pokémon's data
5. Sum the `game_indices` values in code

See? No escaping the code.

## The APIs

### RESTlock Holmes API (Your Game Server)

The game itself is an API you'll interact with:

- `GET /mystery` — Fetch a new mystery case
- `GET /hint` — Get hints when you're stuck
- `POST /submit` — Submit your answers

All endpoints are documented with OpenAPI specs at `/openapi`, so you learn to read real API docs from the start.

### External APIs (The Evidence)

Mysteries send you hunting through real public APIs:
- [PokéAPI](https://pokeapi.co/) — Pokémon data
- [REST Countries](https://restcountries.com/) — Country info
- [Dog CEO](https://dog.ceo/dog-api/) — Dog breeds
- [Open Library](https://openlibrary.org/developers/api) — Book data
- And more...

## What You'll Learn

Real skills developers use every day:

- **Reading API docs** — OpenAPI specs, REST endpoints, parameters
- **Making HTTP requests** — GET, POST, query strings, headers
- **Processing JSON** — Parse responses, extract data, transform values
- **Problem solving** — Chain API calls, filter results, calculate answers
- **Real-world workflows** — The exact process you'd use on the job

## Getting Started

```bash
# Clone the repository
git clone https://github.com/vcsdclub/restlock-holmes.git

# Install dependencies
bun install

# Start the server
bun run dev

# API runs at http://localhost:3000
# Docs at http://localhost:3000/openapi
```

Then visit `http://localhost:3000` for tutorials and examples, or jump straight to `GET /mystery` to start your first case.

## Creating Good Mysteries

Want to contribute puzzles? Effective clues force players to use APIs properly. Here's how:

1. **Large search spaces** — Make manual searching impossible (e.g., "filter 1000+ items")
2. **Calculated answers** — Require aggregations, sums, or transformations
3. **Chained API calls** — Need data from multiple endpoints
4. **API-specific IDs** — Force players to query, not guess

## Tech Stack

- **[Bun](https://bun.sh/)** — Lightning-fast JavaScript runtime
- **[Elysia](https://elysiajs.com/)** — Ergonomic web framework
- **OpenAPI 3.0** — Auto-generated docs (just like real APIs)

## Why This Works

Most API tutorials are boring. You follow step-by-step instructions, copy code, and learn nothing.

RESTlock Holmes is different. You have a *goal* (solve the mystery), and the API is your *tool*. When you need something, you figure it out. That's how real developers work.

The best way to learn isn't through tutorials—it's through **necessity**.

## Contributing

Got ideas for mysteries? Open a PR! Good puzzles:
- Can't be solved by Googling
- Require reading API docs
- Need code to solve (no manual browsing)
- Teach real skills

---

*"The mystery is not in the answer, but in knowing which question to ask the API."*
