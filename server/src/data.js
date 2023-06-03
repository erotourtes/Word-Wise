import fs from "fs";

/*
interface Words {
  word: string;
  definitions: string[];
  synonyms: string[];
  antonyms: string[];
  phonetics: {
    text: string;
    audio: string;
    source: string;
  };
}
*/


const data = JSON.parse(
  fs.readFileSync(`${process.cwd()}/data/words.json`, "utf-8")
);

const wordsNames = Object.keys(data);

export { wordsNames, data };
