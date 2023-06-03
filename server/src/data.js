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

  timesSent: number;
}
*/

class Data {
  constructor() {
    this.data = JSON.parse(
      fs.readFileSync(`${process.cwd()}/data/words.json`, "utf-8")
    );

    const entries = Object.entries(this.data);

    this.sentData = Object.fromEntries(
      entries.filter(([, word]) => word.timesSent > 0)
    );
    this.notSentData = Object.fromEntries(
      entries.filter(([, word]) => word.timesSent == undefined || word.timesSent === 0)
    );
  }

  getRandomWords(count, isSent = true) {
    const data = isSent ? this.sentData : this.notSentData;
    return this.#getRandomWords(count, data);
  }

  #getRandomWords(count, data) {
    if (count > 20)
      throw new Error("Count cannot be more than 20; The algorithm is slow");

    debugger;

    const response = new Set();
    const entries = Object.entries(data); // TODO

    while (response.size < Math.min(count, entries.length)) {
      const randomIndex = Math.floor(Math.random() * entries.length);
      const wordObj = entries[randomIndex][1];
      response.add(wordObj);
    }

    for (const wordObj of response) {
      wordObj.timesSent = (wordObj.timesSent || 0) + 1;
      if (wordObj.timesSent === 1) {
        delete this.notSentData[wordObj.word];
        this.sentData[wordObj.word] = wordObj;
      }
    }

    return Array.from(response);
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
