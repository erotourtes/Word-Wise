import { useTransition, animated, easings, useSpringRef } from "@react-spring/web";
import { ReactNode, useState, useEffect } from "react";

import WordContainer from "./WordContainer";
import { WordI } from "../Interfaces";


export default function WordContainers() {
    const [expandedIndex, setExpanded] = useState(-1);
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
            .then((data) => { setWordList(data) })
            .catch((err) => console.log(err.message));
    }, []);


    const setToLearnedList = (index: number) => {
        const newWords = [...wordList];
        const word = newWords[index];
        newWords.splice(index, 1);

        word.learned = !word.learned;
        setLearned([...learned, word]);

        setWordList(newWords);
    }

    const setToLearnList = (index: number) => {
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


        // Update word on server
        const params = new URLSearchParams();
        params.append("type", "word");
        const options = {
            method: "POST",
            body: JSON.stringify(updatedWord)
        };
        const url = `http://localhost:3000/api/?${params.toString()}`;
        fetch(url, options)
            .then((res) => res.json())
            .then((data) => console.log(data))
            .catch((err) => console.log(err.message));
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
            {
                wordList.length === 0 && <p> New Words </p>
            }
            {transitions((style, item, transitionState, index) => (
                <animated.div style={style}>
                    <WordContainer
                        key={item.word}
                        word={item}
                        setLearned={() => setToLearnedList(index)}
                        setWord={(updatedWord) => setWord(updatedWord, index, false)}
                        isExpanded={expandedIndex === index}
                        setExpanded={(toExpand) => setExpanded(toExpand ? index : -1)} />

                </animated.div>
            ))}

            {learned.length !== 0 && <h2 className="text-2xl font-bold text-center"> Learned Words </h2>}

            {
                learned.length > 0 &&
                learned.map((word, index) => (
                    <WordContainer
                        key={word.word}
                        word={word}
                        setLearned={() => setToLearnList(index)}
                        setWord={(updatedWord) => setWord(updatedWord, index, true)}
                        isExpanded={expandedIndex === index + wordList.length}
                        setExpanded={(toExpand) => setExpanded(toExpand ? index + wordList.length : -1)} />

                ))
            }
        </div>
    );
}
