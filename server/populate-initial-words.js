import fs from "node:fs";
import { dirname } from "path";

const populateData = async () => {
  const appDir = dirname(import.meta.url).replace("file://", "");
  const data = await fs.promises.readFile(
    `${appDir}/data/words.txt`,
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
    `${appDir}/data/words.json`,
    JSON.stringify(words),
    "utf-8"
  );
};

populateData();
