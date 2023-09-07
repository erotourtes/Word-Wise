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

