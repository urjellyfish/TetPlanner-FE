import { Routes, Route } from "react-router-dom";
import CreateNewItem from "./pages/shopping-item/CreateNewItem";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CreateNewItem />} />
    </Routes>
  );
}

export default App;
