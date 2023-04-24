import { useTransition, animated, easings, useSpringRef } from "@react-spring/web";
import { ReactNode, useState, useEffect } from "react";

import WordContainer from "./WordContainer";
import { WordI } from "../Interfaces";


export default function WordContainers() {
    const [words, setWords] = useState<{ [key: string]: WordI }>({});
    const [wordList, setWordList] = useState<WordI[]>([]);
    const [learned, setLearned] = useState<WordI[]>([]);

    useEffect(() => {
        const params = new URLSearchParams();
        params.append("count", "10");
        params.append("type", "random-words");
        const url = `http://localhost:3000/api/?${params.toString()}`;
        const options = { method: "GET" };

        fetch(url, options)
            .then((res) => res.json())
            .then((data) => {
                setWordList(data)
                console.log(data);
            })
            .catch((err) => console.log(err.message));
    }, []);


    const setToLearned = (index: number) => {
        const newWords = [...wordList];
        const word = newWords[index];
        newWords.splice(index, 1);

        word.learned = !word.learned;
        setLearned([...learned, word]);

        setWordList(newWords);
    }

    const setToDeffault = (index: number) => {
        const newWords = [...learned];
        const word = newWords[index];

        word.learned = !word.learned;
        newWords.splice(index, 1);
        setWordList([...wordList, word]);

        setLearned(newWords);
    }

    const setWord = (updatedWord: WordI, index: number, isLearned: boolean) => {
        const newWords = isLearned ? [...learned] : [...wordList];
        newWords.splice(index, 1, updatedWord);

        if (isLearned)
            setLearned(newWords);
        else
            setWordList(newWords);
    }

    const transitions = useTransition(wordList, {
        from: { opacity: 0, transform: "translateY(100px)" },
        enter: { opacity: 1, transform: "translateY(0px)" },
        leave: { opacity: 0, transform: "translateY(-100px)" },
        keys: (item) => item.word,
        config: { duration: 250, tension: 220, friction: 24 },
        trail: 70,
    })


    return (
        <div className="space-y-6 ">
            {transitions((style, item, transitionState, index) => (
                <animated.div style={style}>
                    <WordContainer
                        key={item.word}
                        word={item}
                        setLearned={() => setToLearned(index)}
                        setWord={(updatedWord) => setWord(updatedWord, index, false)} />
                </animated.div>
            ))}
            {
                learned.length > 0 &&
                learned.map((word, index) => (
                    <WordContainer
                        key={word.word}
                        word={word}
                        setLearned={() => setToDeffault(index)}
                        setWord={(updatedWord) => setWord(updatedWord, index, true)} />
                ))
            }
        </div>
    );
}
