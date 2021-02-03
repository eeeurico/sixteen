import React, { useState, useRef } from "react";
import { Header } from "components/components";
import { useHistory } from "react-router-dom";

const settings = window.require("electron-settings");
const { remote } = window.require("electron");

const fs = window.require("fs");

const NotFound = () => {
  let history = useHistory();
  //
  const mode = settings.getSync("mode") || "dark";
  // const [mode, setMode] = useState(settings.getSync("mode") || "dark");

  //
  const [msgError, setMsgError] = useState(false);
  const [newEntry, setNewEntry] = useState(false);
  const inputNewEntry = useRef(null);

  const openFile = () => {
    // open files dialog looking for markdown
    const files = remote.dialog.showOpenDialogSync(false, {
      properties: ["openFile"],
      filters: [{ name: "Txt", extensions: ["txt"] }],
    });

    // if no files
    if (!files) return;

    const file = files[0];
    let currentFiles = settings.getSync("cachedFiles");
    currentFiles.push(file);
    settings.setSync("cachedFiles", currentFiles);

    history.push(`/#${file}`);
  };

  const openDirToSave = () => {
    setMsgError(false);
    // open files dialog looking for markdown
    const directory = remote.dialog.showOpenDialogSync(false, {
      properties: ["openDirectory", "createDirectory"],
    });

    // if no directory
    if (!directory) return;
    const dir = directory[0];

    setNewEntry(dir);
  };

  //
  const clickNewEntry = (e) => {
    e.preventDefault();
    const newEntryName = inputNewEntry.current.value;
    if (!newEntryName) return;
    const filePath = `${newEntry}/${newEntryName}.txt`;

    fs.exists(filePath, function (exists) {
      if (exists) {
        setMsgError("File exists, please use another name.");
      } else {
        fs.writeFile(filePath, "", (err) => {
          if (err) return console.log(err);
          let currentFiles = settings.getSync("cachedFiles");
          currentFiles.push(filePath);
          settings.setSync("cachedFiles", currentFiles);
          history.push(`/#${filePath}`);
        });
      }
    });
  };

  /// Layout
  return (
    <div className={`Layout --${mode}`}>
      <Header
        {...{
          showTabs: false,
        }}
      />

      {newEntry ? (
        <div className="NotFound">
          <div className="NotFound__newFile">
            <form onSubmit={(e) => clickNewEntry(e)}>
              <div className="NotFound__input-wrap">
                <input
                  ref={inputNewEntry}
                  autoFocus
                  type="text"
                  placeholder="File Title"
                />
                {msgError && <div className="--error">{msgError}</div>}
              </div>
              <ul>
                <li>
                  <div
                    className="NotFound__btn"
                    onClick={(e) => setNewEntry(false)}
                  >
                    cancel
                  </div>
                </li>
                <li>
                  <input
                    className="NotFound__btn"
                    type="submit"
                    value="Submit"
                  />
                </li>
              </ul>
            </form>
          </div>
        </div>
      ) : (
        <div className="NotFound">
          <ul>
            <li>
              <div className="NotFound__btn" onClick={(e) => openFile()}>
                Open file
              </div>
            </li>
            <li>
              <div className="NotFound__btn" onClick={(e) => openDirToSave()}>
                New file
              </div>
            </li>
          </ul>

          {/* <span>Press Cmd+0 to open file</span>
        <span>or Cmd+N to create a file</span> */}
        </div>
      )}
    </div>
  );
};

export default NotFound;
