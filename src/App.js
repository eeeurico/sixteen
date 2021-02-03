import React from "react";
import { Layout, NotFound } from "views/views";
import { BrowserRouter as Router, useLocation } from "react-router-dom";

function AppInner() {
  let location = useLocation();
  const { hash = "" } = location;
  let currentFile = hash;
  currentFile = currentFile.substring(1);

  if (currentFile === "new") {
    return <NotFound />;
  } else {
    return <Layout currentFile={currentFile} />;
  }
}

function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}

export default App;
