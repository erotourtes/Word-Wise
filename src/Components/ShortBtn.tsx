import { ReactNode } from "react";
import "../Styles/ShortBtn.scss";

interface Props {
    children: ReactNode;
    onClick?: () => void;
}

export default function ShortBtn({ children, onClick }: Props) {
    return (
        <>
            <div className="shortBtn" onClick={onClick}>
                {children}
            </div>
        </>);
}
