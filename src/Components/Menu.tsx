import Button from "./Button"
import { States } from "../App";

interface Props {
    state: States;
    setState: (state: States) => void;
}


export default function Menu({ state, setState }: Props) {
    const menu =
        Object.keys(States).map((key) => {
            const curKey = key as keyof typeof States;
            const curState = States[curKey];
            return (
                <Button onClick={() => setState(States[curKey])}>
                    <h1 className={state === curState  ? "underline" : ""}>{key}</h1>
                </Button>)
        });

    return (
        <div className="bg-darken my-10 px-10 pb-5 rounded-lg">
            <div className="text-3xl flex justify-center space-x-12 mb-3"> {menu} </div>
            <p className="text-center">
                0/10
            </p>
        </div>
    );
}
