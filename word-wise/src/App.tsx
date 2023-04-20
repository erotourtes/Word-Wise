import "./Styles/index.css";
import WordContainers from "./Components/WordContainers";
import Content from "./Components/Content";
import Header from "./Components/Header";
import { useState } from "react";


function App() {
  return (
    <div className="dark:bg-dark dark:text-text min-h-screen">
      <Content>
        <Header/>
      </Content>

      <Content>
          <WordContainers />
      </Content>
    </div>
  );
}

export default App;
