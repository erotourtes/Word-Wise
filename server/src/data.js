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

  wasSent: boolean;
}
*/

class Data {
  constructor() {
    this.data = JSON.parse(
      fs.readFileSync(`${process.cwd()}/data/words.json`, "utf-8")
    );

    const entries = Object.entries(this.data);

    this.sentData = Object.fromEntries(
      entries.filter(([, word]) => word.wasSent)
    );
    this.notSentData = Object.fromEntries(
      entries.filter(([, word]) => !word.wasSent)
    );
  }

  get wordsNames() {
    return Object.keys(this.data);
  }

  getRandomWords(count) {
    const response = [];
    const len = this.wordsNames.length;
    for (let i = 0; i < Math.min(count, len); i++) {
      const randomIndex = Math.floor(Math.random() * len);
      const randomWord = this.wordsNames[randomIndex];
      const wordObj = this.getWordByName(randomWord);
      response.push(wordObj);
    }

    return response;
  }

  updateWord(word, newData) {
    this.data[word] = newData;
  }

  getWordByName(name) {
    return this.data[name];
  }

  save() {
    // Violates the single responsibility principle
    fs.writeFile(
      `${process.cwd()}/data/backup.json`,
      JSON.stringify(this.data),
      "utf-8"
    ).catch((err) => console.log(err));
  }
}

export default new Data();
