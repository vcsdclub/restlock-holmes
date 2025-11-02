export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Clue {
	id: string;
	text: string;
	apiHint: string;
	hintsAvailable: number; // Number of hints available for this clue
}

export interface Mystery {
	mysteryId: string;
	title: string;
	difficulty: Difficulty;
	scenario: string;
	currentClue: Clue; // Only show the current clue
	// currentClueIndex: number;
	totalClues: number;
	createdAt: string;
}

export interface Hint {
	mysteryId: string;
	clueId: string;
	hint: string;
}

export interface SubmitRequest {
	mysteryId: string;
	clueId: string;
	answer: string;
}

// `correct`, `message`, and `mysterySolved` will always exist
export type SubmitResponse =
	| {
			correct: true;
			mysterySolved: false;
			message: "Correct! Here's your next clue...";
			mysteryId: string;
			clueId: string;
			nextClue: Clue;
	  }
	| {
			correct: true;
			mysterySolved: true;
			message: "Correct! You've solved the entire mystery!";
			mysteryId: string;
			clueId: string;
			conclusion: string;
	  }
	| {
			correct: false;
			mysterySolved: false;
			message: 'Not quite right. Try again, or request a hint!';
			mysteryId: string;
			clueId: string;
	  };

export interface ApiError {
	error: string;
	message: string;
	details?: Record<string, any>;
}

// Internal type for loaded mysteries from YAML
export interface MysteryData {
	id: string;
	title: string;
	difficulty: Difficulty;
	scenario: string;
	clues: Array<{
		id: string;
		text: string;
		apiHint: string;
		answer: string;
		hints: string[]; // Hints for this specific clue
	}>;
	conclusion: string;
}
