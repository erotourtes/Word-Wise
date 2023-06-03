import fs from "node:fs";

export class ResponseError extends Error {
  constructor(message, messageToUser = "", status = "400") {
    super(message);
    this.status = status;
    this.messageToUser = messageToUser;
  }
}

export const isRightWordInterface = (wordObj) =>
  typeof wordObj === "object" &&
  typeof wordObj.word === "string" &&
  Array.isArray(wordObj.definitions) &&
  Array.isArray(wordObj.synonyms) &&
  Array.isArray(wordObj.antonyms) &&
  typeof wordObj.phonetics === "object" &&
  typeof wordObj.phonetics.text === "string" &&
  typeof wordObj.phonetics.audio === "string";

export const getNecessaryDataOf = (wordObj) => {
  const word = {};
  word.word = wordObj.word;
  word.definitions = wordObj.definitions;
  word.synonyms = wordObj.synonyms;
  word.antonyms = wordObj.antonyms;
  word.phonetics = wordObj.phonetics;

  return word;
};

export const populateData = async () => {
  const data = await fs.promises.readFile(
    `${process.cwd()}/data/words.txt`,
    "utf-8"
  );
  const words = {};
  for (const word of data.split("\n")) {
    words[word] = {
      word,
      synonyms: [],
      antonyms: [],
      definitions: [],
      phonetics: {},
    };
  }
  await fs.promises.writeFile(
    `${process.cwd()}/data/words.json`,
    JSON.stringify(words),
    "utf-8"
  );
};
