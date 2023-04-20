import { useTransition, animated, easings, useSpringRef } from "@react-spring/web";
import { ReactNode, useState, useEffect } from "react";

import WordContainer from "./WordContainer";

export interface WordI {
    word: string;
    definitions?: string[];
    synonyms?: string[];
    antonyms?: string[];
    phonetics?: { text: string; audio: string; source: string };

    learned: boolean;
}


export default function WordContainers() {
    const [words, setWords] = useState<{ [ key: string ]: WordI}>({});
    const [wordList, setWordList] = useState<WordI[]>([]);

    useEffect(() => {
        const params = new URLSearchParams();
        params.append("count", "10");
        params.append("type", "random-words");
        const url = `localhost:3000/api/${params.toString()}`;
        const options = { method: "GET" }

        fetch(url, options)
            .then((res) => res.json())
            .then((data) => setWords(data));
    }, []);


    const changeOrder = (index: number) => {
        const newWords = [...wordList];
        const word = wordList[index];

        if (word.learned)
            newWords.unshift(word);
        else
            newWords.push(word);

        word.learned = !word.learned;
        setWordList(newWords);
    }

    const transitions = useTransition(wordList, {
        from: { opacity: 0, transform: "translateY(100px)" },
        enter: { opacity: 1, transform: "translateY(0px)" },
        leave: { opacity: 0, transform: "translateY(-100px)" },
        keys: (item) => item.word,
        config: { easing: easings.easeInBounce, },
        trail: 70,
    })


    // useEffect(() => {
    //     const word = words[0].word;
    //     fetch(`wrong_https://api.dictionaryapi.dev/api/v2/entries/en_US/${word}`)
    //     .then((res) => res.json())
    //     .then((data) => console.log(data));
    // });

    return (
        <div className="space-y-6">
            {transitions((style, item, transitionState, index) => (
                <animated.div style={style}>
                    <WordContainer
                        key={item.word}
                        word={item}
                        setLearned={() => changeOrder(index)} />
                </animated.div>
            ))}
        </div>
    );
}
