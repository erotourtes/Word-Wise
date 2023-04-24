import "./config.js";
import http from "http";
import fs from "fs";
import url from "url";

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

const populateData = async () => {
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

const isRightWordInterface = (wordObj) =>
  typeof wordObj === "object" &&
  typeof wordObj.word === "string" &&
  Array.isArray(wordObj.definitions) &&
  Array.isArray(wordObj.synonyms) &&
  Array.isArray(wordObj.antonyms) &&
  typeof wordObj.phonetics === "object" &&
  typeof wordObj.phonetics.text === "string" &&
  typeof wordObj.phonetics.audio === "string";

const data = JSON.parse(
  fs.readFileSync(`${process.cwd()}/data/words.json`, "utf-8")
);

const wordsNames = Object.keys(data);

class ResponseError extends Error {
  constructor(message, messageToUser = "", status = "400") {
    super(message);
    this.status = status;
    this.messageToUser = messageToUser;
  }
}

const routes = {
  GET: {
    "random-words": ({ count }) => {
      if (!count)
        throw new ResponseError(
          "",
          `Number of words (<count> property) is required\nExample: http://localhost:3000/?type=random-words&count=10`
        );

      const response = [];
      const len = wordsNames.length;
      for (let i = 0; i < Math.min(count, len); i++) {
        const randomIndex = Math.floor(Math.random() * len);
        const randomWord = wordsNames[randomIndex];
        const wordObj = data[randomWord];
        response.push(wordObj);
      }

      return response;
    },
    word: ({ word }) => {
      if (!word)
        throw new ResponseError(
          "",
          `Word (<word> property) is required\nExample: http://localhost:3000/?type=word&word=hello`
        );

      const wordObj = data[word];
      if (!wordObj)
        throw new ResponseError(
          "",
          `Word ${word} is not found in the database`
        );

      return wordObj;
    },
  },
  POST: {
    word: ({ body }) => {
      if (!body || !isRightWordInterface(body))
        throw new ResponseError(
          "",
          "Data is missing or data is not in the right format"
        );
      const word = body.word;

      data[word] = body;
      console.log("updated:", data[word]);

      fs.writeFile(
        `${process.cwd()}/data/words.json`,
        JSON.stringify(data),
        "utf-8",
        () => {
          console.log("saved words");
        }
      );
      return true;
    },
  },
};

const getData = async (req) => {
  const buffer = [];
  for await (const chunk of req) {
    buffer.push(chunk);
  }
  const body = Buffer.concat(buffer).toString();
  return body.length ? body : null;
};

const port = process.env.PORT || 3000;
const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const link = req.url;
  const method = req.method;
  const query = url.parse(link, true).query;
  const body = await getData(req);

  console.log(
    `link: ${link} ${JSON.stringify(query)} ${
      body && Object.keys(body) ? "body is not empty" : "body is empty"
    }`
  );

  try {
    const dataRecieved = { ...query, body: JSON.parse(body) };
    const router = routes[method][query.type];
    const words = router(dataRecieved);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(words));
  } catch (err) {
    console.log(err.message, err.messageToUser);
    res.statusCode = 400;
    const avaliableRoutes = Object.keys(routes[method]);
    const example = `Example: http://localhost:3000/?type=${avaliableRoutes[0]}`;
    const msg = `Maybe you meant: ${avaliableRoutes}\nExample: ${example}`;
    res.end(
      `An error occured\n${err.messageToUser}\n${err.messageToUser ? "" : msg}`
    );
  }
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

process.on("exit", () => {
  console.log("exit");
  fs.writeFile(
    `${process.cwd()}/data/backup.json`,
    JSON.stringify(data),
    "utf-8"
  ).catch((err) => console.log(err));
});
