import React from "react";
import MarkmapHooks from "./markmap-hooks";

const App = () => {
  const initialMarkdown = `
# Welcome to Mindmap AI
- Type a query to generate a mindmap
`;

  return (
    <div className="w-full h-screen overflow-hidden">
      <MarkmapHooks markdown={initialMarkdown} />
    </div>
  );
};

export default App;
