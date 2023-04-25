import { WordI } from "../Utils/Interfaces";

type WordsAction =
    | { type: "POPULATE_UNLEARNED", items: WordI[] }
    | { type: "MOVE_TO_LEARNED", item: WordI }
    | { type: "MOVE_TO_UNLEARNED", item: WordI }
    | { type: "UPDATE_WORD", item: WordI }

interface WordsState {
    wordList: WordI[],
    learned: WordI[]
}

export default function WordsReducer(state: WordsState, action: WordsAction): WordsState {
    switch (action.type) {
        case "POPULATE_UNLEARNED":
            return {
                wordList: action.items,
                learned: state.learned,
            };
        case "MOVE_TO_LEARNED":
            action.item.learned = true;
            return {
                wordList: state.wordList.filter((word: WordI) => word.word !== action.item.word),
                learned: [...state.learned, action.item]
            };
        case "MOVE_TO_UNLEARNED":
            action.item.learned = false;
            return {
                wordList: [...state.wordList, action.item],
                learned: state.learned.filter((word: WordI) => word.word !== action.item.word)
            };
        case "UPDATE_WORD":
            const word = action.item;
            const updateWord = (w: WordI) => w.word === word.word ? word : w;
            return word.learned ?
                {
                    wordList: state.wordList,
                    learned: state.learned.map(updateWord),
                }
                : {
                    wordList: state.wordList.map(updateWord),
                    learned: state.learned,
                }
        default:
            throw new Error("Invalid action type");
    }
}
