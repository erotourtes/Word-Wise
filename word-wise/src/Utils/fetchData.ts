import { FetchedWord, ServerWord } from "./Interfaces";

export const fetchDictionary = async (word: string): Promise<ServerWord> => {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  const data = await fetch(url)
    .then((res) => res.json())
    .catch((err) => console.log(err.message));
  const wordData: FetchedWord = data[0];

  const phonetics = wordData.phonetics ? wordData.phonetics[0] : { text: "", audio: "" };
  phonetics.text = phonetics.text || "";
  phonetics.audio = phonetics.audio || "";
  const definitions = [];
  const synonyms = [];
  const antonyms = [];

  for (const key in wordData.meanings) {
    const meaning = wordData.meanings[key];
    for (const definition of meaning.definitions) {
      definitions.push(definition.definition);
      synonyms.push(...(definition.synonyms || []));
      antonyms.push(...(definition.antonyms || []));
    }
  }

  const wordObj = {
    word: wordData.word,
    phonetics,
    definitions,
    synonyms,
    antonyms,
  };

  return wordObj;
};