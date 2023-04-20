import { ReactNode, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import Button from "./Button";
import ShortBtn from "./ShortBtn";
import { WordI } from "./WordContainers";

interface Props {
  setLearned: () => void;
  word: WordI
}

export default function WordContainer({ word,  setLearned }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [discarded, setDiscarded] = useState(false);
  const isHidden = expanded ? "block" : "hidden";
  const isDiscarded = discarded ? "brightness-75" : "";

  const makeCollapsed = () => {
    setDiscarded(!discarded); setExpanded(false);
  }

  return (
      <div className={`${isDiscarded} p-5 rounded-lg bg-darken flex flex-col items-center max-w-lg m-auto relative`}>
        <h1 className={`text-center text-5xl mb-4`}>
          {word.word}
        </h1>
        <Button onClick={() => setExpanded(!expanded)}>{expanded ? "Hide  " : "Expand"}</Button>


        <div className={`flex flex-col absolute left-2 top-2`}>
          <ShortBtn onClick={() => { makeCollapsed(); setLearned() }}>Done</ShortBtn>
          <ShortBtn onClick={makeCollapsed}>{discarded ? "Undo" : "Discard"}</ShortBtn>
        </div>
        <div className={`mt-4 ${isHidden} w-full`}>
          <p>Definition</p>
          <p>Transcription</p>
          <p>Translation</p>
        </div>
      </div>
  );
}
