import React from "react";
import EditorWindow from "./EditorWindow";
import ResumedEditorWindow from "./ResumedEditorWindow";
import "./App.css";
import Login from "./Login";
import View from "./View";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/editor" element={<EditorWindow />} />
        <Route path="/resumedEditor/:id" element={<ResumedEditorWindow />}>
          {/* <Route path=":userName" element={<ResumedEditorWindow />} /> */}
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/view" element={<View />} />
          </Routes>
    </div>
    </Router>
  );
}

export default App;
