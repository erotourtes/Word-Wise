import { ReactNode } from "react";
import Button from "./Button";

interface Props {
  children: ReactNode;
}

export default function WordContainer({ children }: Props) {
  return (
    <div className = "p-5 rounded-lg bg-darken flex flex-col items-center max-w-lg m-auto">
      <h1 className="text-center text-5xl mb-4">
        {children}
      </h1>
      <Button>Expand</Button>
    </div>
  );
}
