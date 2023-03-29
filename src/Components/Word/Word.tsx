import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Word({ children }: Props) {
  return (
    <li className = "flex p-5 bg-slate-700 w-min rounded-lg">
      {children}
    </li>
  );
}
