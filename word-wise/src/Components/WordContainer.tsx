import { ReactNode, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import Button from "./Button";
import ShortBtn from "./ShortBtn";
import { FetchedWord, ServerWord, WordI } from "../Interfaces";

const fetchData = async (word: string): Promise<ServerWord> => {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  const data = await fetch(url)
    .then((res) => res.json())
    .catch((err) => console.log(err.message));
  const wordData: FetchedWord = data[0];

  const phonetics = wordData.phonetics ? wordData.phonetics[0] : { text: "", audio: "" };
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

  console.log(wordObj)

  return wordObj;
};

interface Props {
  setLearned: () => void,
  word: WordI,
  setWord: (word: WordI) => void,
}

export default function WordContainer({ word, setLearned, setWord }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [discarded, setDiscarded] = useState(word.learned);
  const isHidden = expanded ? "block" : "hidden";
  const isDiscarded = discarded ? "brightness-75" : "";

  const makeCollapsed = () => {
    setDiscarded(!discarded); setExpanded(false);
  }

  const expand = () => {
    if (word.definitions?.length === 0) {
      fetchData(word.word).then((data) => {
        setWord({ ...data, learned: word.learned });
      });
    }

    setExpanded(!expanded);
  }

  // fetchData(word.word);

  return (
    <div className={`${isDiscarded} p-5 rounded-lg bg-darken flex flex-col items-center max-w-lg m-auto relative`}>
      <h1 className={`text-center text-5xl mb-4`}>
        {word.word}
      </h1>
      <Button onClick={expand}>{expanded ? "Hide  " : "Expand"}</Button>

      <div className={`flex flex-col absolute left-2 top-2`}>
        <ShortBtn onClick={() => { makeCollapsed(); setLearned() }}>Done</ShortBtn>
      </div>
      <div className={`mt-4 ${isHidden} w-full`}>
        <div>Deffinition: {word.definitions?.map((definition, index) =>
          <p key={definition} className="text-darken-text">{index + 1}) {definition}</p>
        )}</div>
        <div>Phonetics: <p className="text-darken-text">{word.phonetics?.text}</p></div>

        {word.phonetics?.audio && <audio src={word.phonetics?.audio} controls></audio>}
      </div>
    </div>
  );
}