import { FetchedWord, ServerWord } from "./Interfaces";

export const fetchDictionary = async (word: string): Promise<ServerWord> => {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  const data = await fetch(url)
    .then((res) => res.json())
    .catch((err) => console.log("In fetch dictionary", err.message));
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

export const fetchRandomWords = async (count: number): Promise<ServerWord[]> => {
  const params = new URLSearchParams();
  params.append("count", count.toString());
  params.append("type", "random-words");
  const url = `http://localhost:3000/api/?${params.toString()}`;
  const options = { method: "GET" };

  return fetch(url, options)
    .then((res) => res.json())
    .catch((err) => console.log(err.message));
}

export const updateWordOnServer = async (word: ServerWord): Promise<void> => {
        const params = new URLSearchParams();
        params.append("type", "word");
        const options = {
            method: "POST",
            body: JSON.stringify(word)
        };
        const url = `http://localhost:3000/api/?${params.toString()}`;
        return fetch(url, options)
            .then((res) => res.json())
            .then((data) => console.log(data))
            .catch((err) => console.log(err.message));
}