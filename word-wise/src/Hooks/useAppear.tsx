import { useSpring, animated } from "@react-spring/web";
import { useRef, useState } from "react";

interface AppearProps {
  startX: number,
  x: number,
}

const useAppear = ({ startX, x }: AppearProps): [{ [key: string]: any }, () => void] => {
  const isAppeared = useRef(false);
  const [style, api] = useSpring(() => ({
    x: startX,
  }), []);

  const toggle = () => {
    isAppeared.current = !isAppeared.current;
    api.start({ x: isAppeared.current ? x : startX, });
  };
  return [style, toggle];
}

export default useAppear;