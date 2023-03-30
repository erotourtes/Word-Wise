import { ReactNode } from "react";
import WordContainer from "./WordContainer";

interface Props {
}


export default function WordContainers() {
    const words = ["Hello", "world", "this", "is", "a", "test", "of", "the", "emergency", "broadcast", "system"];

    return (
        <>
            <div className="space-y-6">
                {words.map((word) => (
                        <WordContainer>{word}</WordContainer>
                ))}
            </div>
        </>
    );
}
