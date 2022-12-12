import React from "react";
/* Global Css */
import "./App.css";
/* Bootstrap */
import { BrowserRouter as Router } from "react-router-dom";
import Visual from "./components/index";
function App() {
  return (
    <Router>
      <Visual />
    </Router>
  );
}

export default App;
