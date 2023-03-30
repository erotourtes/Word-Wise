import { ReactNode } from "react";
import "../Styles/Btn.scss";

interface Props {
  children: ReactNode;
  onClick?: () => void;
}

export default function Content({ children, onClick }: Props) {
  return (
      <div className="btn" onClick = {onClick}>
        {children}
      </div>
  );
}
