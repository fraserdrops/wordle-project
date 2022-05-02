import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Counter } from "./features/counter/Counter";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <Counter />
      </header>
    </div>
  );
}

export default App;
