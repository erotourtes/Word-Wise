import {
  getNecessaryDataOf,
  isRightWordInterface,
  ResponseError,
} from "./Utils.js";

import { config } from "./config.js";
import data from "./data.js";

const routes = {
  GET: {
    "random-words": ({ count, isSent }) => {
      if (!count)
        throw new ResponseError(
          "",
          `Number of words (<count> property) is required\nExample: http://${config.HOST}:${config.PORT}/?type=random-words&count=10&isSent=false`
        );

      count = parseInt(count) || 1;
      isSent = isSent === "true";

      return data.getRandomWords(count, isSent);
    },
    word: ({ word }) => {
      if (!word)
        throw new ResponseError(
          "",
          `Word (<word> property) is required\nExample: http://${config.HOST}:${config.PORT}/?type=word&word=hello`
        );

      const wordObj = data.getWordByName(word);
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

      data.updateWord(word, getNecessaryDataOf(body));
      console.log("updated:", data.getWordByName(word));

      data.save()

      return true;
    },
  },
};

export default routes;
