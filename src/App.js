import { jsx as _jsx } from "react/jsx-runtime";
import MarkmapHooks from "./markmap-hooks";
const App = () => {
    const initialMarkdown = `
# Welcome to Mindmap AI
- Type a query to generate a mindmap
`;
    return (_jsx("div", { className: "w-full h-screen overflow-hidden", children: _jsx(MarkmapHooks, { markdown: initialMarkdown }) }));
};
export default App;
