import { useState } from "react";

import "./App.css";
import GridExample from "./sample";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="text-blue-400 font-bold">
      <GridExample />
    </div>
  );
}

export default App;
