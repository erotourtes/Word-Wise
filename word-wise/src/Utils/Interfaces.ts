interface Definition {
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
}

interface Phonetics {
  text: string;
  audio?: string;
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

export interface FetchedWord {
  word: string;
  phonetic?: string;
  phonetics?: Phonetics[];
  origin?: string;
  meanings: Meaning[];
}

export interface ServerWord {
    word: string;
    definitions?: string[];
    synonyms?: string[];
    antonyms?: string[];
    phonetics?: Phonetics;
}


export interface WordI extends ServerWord {
    learned: boolean;
}
