import React, { useState, useEffect, useRef } from "react";
import { Main, Header } from "components/components";

const settings = window.require("electron-settings");
const { ipcRenderer } = window.require("electron");

const fs = window.require("fs");

const Layout = ({ currentFile = false }) => {
  const [mode, setMode] = useState(settings.getSync("mode") || "dark");
  const input = useRef(null);

  const currentFileSplit = currentFile.split("/");

  const filesData = [
    {
      path: new URL(`file://${currentFile}`),
      title: currentFileSplit[currentFileSplit.length - 1],
    },
  ];
  const [loadedFile, setLoadedFile] = useState(null);
  const [tab, setTab] = useState(false);

  useEffect(() => {
    if (!loadedFile && currentFile && filesData[0]) {
      loadFile(filesData[0]);

      ipcRenderer.on("save-file", () => {
        saveFile();
      });
    }
  });

  const switchMode = (color) => {
    // settings.set("mode", color);
    setMode(color);
  };

  const loadFile = ({ path = false }) => {
    if (!path) return;
    const content = fs.readFileSync(path).toString();
    setLoadedFile(content);
  };

  const saveFile = () => {
    if (!filesData.length) return;
    fs.writeFile(filesData[0].path, input.current.value, (err) => {
      if (err) return console.log(err);
      console.log("saved");
    });
  };

  return (
    <div className={`Layout --${mode}`}>
      <Header
        {...{
          showTabs: true,
          tab,
          setTab,
          switchMode,
          mode,
          title:
            filesData && filesData[0] && filesData[0].title
              ? filesData[0].title
              : false,
        }}
      />

      <div className={`Layout__main`}>
        {loadedFile !== null && (
          <Main
            {...{
              file: loadedFile,
              setLoadedFile,
              input,
            }}
            key={"main--" + currentFile}
          />
        )}
      </div>
    </div>
  );
};

export default Layout;
