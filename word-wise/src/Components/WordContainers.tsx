import { useTransition, animated, easings, useSpringRef } from "@react-spring/web";
import { ReactNode, useState, useEffect, useReducer, useRef } from "react";

import WordContainer from "./WordContainer";
import { ServerWord, WordI } from "../Utils/Interfaces";
import WordsReducer from "../Reducers/wordsReducer";
import { fetchRandomWords, updateWordOnServer } from "../Utils/fetchData";

function useFetch() {
    const [listState, dispatch] = useReducer(WordsReducer, { wordList: [], learned: [] });
    const isEmpty = listState.wordList.length === 0;

    useEffect(() => {
        if (!isEmpty) return;
        fetchRandomWords(10)
            .then((data =>
                data.map(word => {
                    const rightWord: WordI = { ...word, learned: false };
                    return rightWord;
                })
            ))
            .then((data) => dispatch({ type: "POPULATE_UNLEARNED", items: data }))
            .catch((err) => {
                dispatch({
                    type: "POPULATE_UNLEARNED", items: [
                        { word: "Error", learned: false },
                        { word: "server", learned: false },
                        { word: "is", learned: false },
                        { word: "not", learned: false },
                        { word: "responding", learned: false },
                    ]
                }); // just to show something
            });
    }, [isEmpty]);

    return [listState, dispatch] as const;
}

export default function WordContainers() {
    const [expandedIndex, setExpanded] = useState(-1);
    const [listState, dispatch] = useFetch();
    const wordList = listState.wordList;
    const learned = listState.learned;

    const setToLearnedList = (index: number) => dispatch({ type: "MOVE_TO_LEARNED", item: listState.wordList[index] });
    const setToUnlearnedList = (index: number) => dispatch({ type: "MOVE_TO_UNLEARNED", item: listState.learned[index] });
    const setWord = (updatedWord: WordI, index: number, isLearned: boolean) => {
        dispatch({ type: "UPDATE_WORD", item: updatedWord });
        updateWordOnServer(updatedWord);
    }

    const transitions = useTransition(wordList, {
        from: { opacity: 0, transform: "translateY(100px)" },
        enter: { opacity: 1, transform: "translateY(0px)" },
        leave: { opacity: 0, transform: "translateY(15px)", left: 0, position: "absolute", width: "100%" },
        keys: (item) => item.word,
        config: { duration: 250, tension: 220, friction: 24 },
        trail: 70,
    })

    return (
        <div className="space-y-6 pb-10 ">
            {transitions((style, item, transitionState, index) => (
                <animated.div style={style}>
                    <WordContainer
                        key={item.word}
                        word={item}
                        setLearned={() => setToLearnedList(index)}
                        setWord={(updatedWord) => setWord(updatedWord, index, false)}
                        isExpanded={expandedIndex === index}
                        setExpanded={(toExpand) => {
                            if (expandedIndex !== index && expandedIndex !== -1 && !toExpand) { setExpanded(index > expandedIndex ? expandedIndex : expandedIndex - 1); return };
                            setExpanded(toExpand ? index : -1)
                        }} />

                </animated.div>
            ))}

            {learned.length !== 0 && <h2 className="text-2xl font-bold text-center"> Learned Words </h2>}

            {
                learned.length > 0 &&
                learned.map((word, index) => (
                    <WordContainer
                        key={word.word}
                        word={word}
                        setLearned={() => setToUnlearnedList(index)}
                        setWord={(updatedWord) => setWord(updatedWord, index, true)}
                        isExpanded={expandedIndex === index + wordList.length}
                        setExpanded={(toExpand) => setExpanded(toExpand ? index + wordList.length : -1)} />

                ))
            }
        </div>
    );
}
