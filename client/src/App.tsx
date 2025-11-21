import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@fontsource/inter";

import HomePage from "./pages/HomePage";
import CPSClicker from "./pages/CPSClicker";
import TypingRace from "./pages/TypingRace";
import MultiplayerRace from "./pages/MultiplayerRace";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cps-clicker" element={<CPSClicker />} />
        <Route path="/typing-race" element={<TypingRace />} />
        <Route path="/multiplayer-race" element={<MultiplayerRace />} />
      </Routes>
    </Router>
  );
}

export default App;
