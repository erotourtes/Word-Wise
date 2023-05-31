import { ReactNode, useState, useEffect, MouseEvent, useRef, useLayoutEffect } from "react";
import Button from "./Button";
import ShortBtn from "./ShortBtn";
import { WordI } from "../Utils/Interfaces";
import useAppear from "../Hooks/useAppear";
import { fetchDictionary } from "../Utils/fetchData";
import { animated } from "@react-spring/web";


interface Props {
  setLearned: () => void,
  word: WordI,
  setWord: (word: WordI) => void,
  setExpanded: (isExpanded: boolean) => void,
  isExpanded: boolean,
}

export default function WordContainer({ word, setLearned, setWord, setExpanded, isExpanded }: Props) {
  const isHidden = isExpanded ? "block" : "hidden";
  const isDiscarded = word.learned ? "brightness-75" : "";
  const [style, trigger] = useAppear({ startX: -70, x: 0 });
  const heightRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const firstRender = useRef(0); // TODO: remove this in production version

  useEffect(() => {
    if (firstRender.current < 2) return (firstRender.current++, undefined); // TODO: remove this in production version

    if (word.definitions?.length === 0) {
      console.log("making actual request")
      fetchDictionary(word.word).then((data) => {
        setWord({ ...data, learned: word.learned });
      }).catch((err) => {
        console.log(err.message);
      });
    }
  }, [isExpanded]);

  const expand = () => setExpanded(!isExpanded);

  useEffect(() => {
    setHeight(heightRef.current?.clientHeight || 0);
  }), [isExpanded];

  return (
    <div ref={heightRef} onMouseEnter={trigger} onMouseLeave={trigger} className={`${isDiscarded} p-5 rounded-lg bg-darken flex flex-col items-center max-w-lg m-auto relative overflow-x-clip`}>
      <h1 className={`text-center text-5xl mb-4`}>
        {word.word}
      </h1>
      <Button onClick={expand}>{isExpanded ? "Hide  " : "Expand"}</Button>

      <animated.div style={style} className={`flex flex-col absolute left-2 top-2`}>
        <ShortBtn onClick={() => { setExpanded(false); setLearned() }}>{word.learned ? "Undo" : "Done"}</ShortBtn>
      </animated.div>

      <div className={`mt-4 ${isHidden} w-full`}>
        <div>Deffinition: {word.definitions?.map((definition, index) =>
          <p key={definition} className="text-darken-text">{index + 1}) {definition}</p>
        )}</div>
        <div>Phonetics: <p className="text-darken-text">{word.phonetics?.text}</p></div>

        {word.phonetics?.audio && <audio src={word.phonetics?.audio} controls></audio>}

        {height > 700 && <div className="flex justify-end">
          <Button onClick={expand}>Hide</Button>
          <Button onClick={() => { setExpanded(false); setLearned() }}>{word.learned ? "Undo" : "Done"}</Button>
        </div>}
      </div>
    </div>
  );
}