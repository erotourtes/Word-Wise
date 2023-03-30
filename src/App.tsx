import "./Styles/index.css";
import WordContainers from "./Components/WordContainers";
import Content from "./Components/Content";
import Header from "./Components/Header";
import Menu from "./Components/Menu";
import { useState } from "react";

export enum States {
  PREPARE = "PREPARE",
  TEST = "TEST",
}

function App() {
  const [ state, setState ] = useState(States.PREPARE);

  return (
    <div className="dark:bg-dark dark:text-text min-h-screen">
      <Content>
        <Header/>
      </Content>

      <Content>
        <Menu setState={setState} state={state} />
        {
          state === States.PREPARE ?  <WordContainers /> : "empty"
        }
      </Content>
    </div>
  );
}

export default App;
