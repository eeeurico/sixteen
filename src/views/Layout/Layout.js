import React, { useState, useEffect } from "react";
import { Main, Sidebar, Metronome } from "components/components";

const settings = window.require("electron-settings");
const { ipcRenderer } = window.require("electron");
const fs = window.require("fs");

const Layout = () => {
  const [loadedFile, setLoadedFile] = useState(null);
  const [filesData, setFilesData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [tab, setTab] = useState(false);

  const [directory, setDirectory] = useState(
    settings.getSync("directory") || null
  );

  useEffect(() => {
    if (!filesData.length && directory) {
      loadAndReadFiles(directory);
    }
    if (directory && filesData.length && loadedFile === null) {
      loadFile(0);
    }

    ipcRenderer.on("new-dir", (event, directory) => {
      setDirectory(directory);
      settings.set("directory", directory);
      loadAndReadFiles(directory);
    });

    ipcRenderer.on("save-file", () => {
      saveFile();
    });
  });

  const loadAndReadFiles = (directory) => {
    fs.readdir(directory, (err, files) => {
      const filteredFiles = files.filter((file) => file.includes(".txt"));
      const filesDataMain = filteredFiles.map((file) => ({
        path: `${directory}/${file}`,
        title: file,
      }));

      console.log(filesDataMain);

      setFilesData(filesDataMain);
      // loadFile(0);
      // setFilesData;
    });
  };

  const changeFile = (index) => {
    if (activeIndex !== index) {
      saveFile();
      loadFile(index);
    }
  };

  const loadFile = (index) => {
    const content = fs.readFileSync(filesData[index].path).toString();
    setLoadedFile(content);
    setActiveIndex(index);
  };

  const saveFile = () => {
    // console.log(filesData, activeIndex);
    if (!filesData.length) return;
    fs.writeFile(filesData[activeIndex].path, loadedFile, (err) => {
      if (err) return console.log(err);
      console.log("saved");
    });
  };

  const newFile = (newEntryName) => {
    const filePath = `${directory}/${newEntryName}.txt`;
    fs.writeFile(filePath, "", (err) => {
      if (err) return console.log(err);

      let newFilesData = filesData;
      newFilesData.unshift({
        path: filePath,
        title: `${newEntryName}.txt`,
      });

      setFilesData(newFilesData);
      loadFile(0);
    });
  };

  return (
    <div className={"Layout"}>
      <div className={"Layout__header"}>Sixteen</div>

      {directory ? (
        <div className={`Layout__main ${tab ? "has-tab" : ""}`}>
          <Sidebar
            {...{
              activeIndex,
              newFile,
              filesData,
              changeFile,
              tab,
              setTab,
            }}
          />
          <Metronome />

          {loadedFile !== null && (
            <Main
              {...{
                file: loadedFile,
                setLoadedFile,
              }}
              key={"main--" + activeIndex}
            />
          )}
        </div>
      ) : (
        <div className="Layout__notFound">
          <span>Press CmdORCtrl+0 to open directory</span>
        </div>
      )}
    </div>
  );
};

export default Layout;
