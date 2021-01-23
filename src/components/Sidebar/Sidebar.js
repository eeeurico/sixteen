import React, { useRef, useState } from "react";
import rhymes from "rhymes";
import { SvgLib } from "components/components";

const Sidebar = ({
  newFile,
  changeFile,
  filesData = [],
  activeIndex = 0,
  tab,
  setTab,
}) => {
  const inputNewEntry = useRef(null);
  const inputRhymes = useRef(null);
  //
  const [newEntry, setNewEntry] = useState(false);
  const [rhymeWord, setRhymeWord] = useState("");
  const [rhymesArray, setRhymesArray] = useState([]);

  //
  const clickNewEntry = (e) => {
    e.preventDefault();
    const newEntryName = inputNewEntry.current.value;
    if (!newEntryName) return;
    newFile(newEntryName);
    setNewEntry(false);
  };

  const newRhyme = () => {
    const newRhymeValue = inputRhymes.current.value;
    setRhymeWord();
    setRhymesArray(newRhymeValue ? rhymes(newRhymeValue) : []);
  };

  const tabs = [
    {
      title: "+",
      icon: "files",
      slug: "files",
    },
    {
      title: "r",
      slug: "rhymes",
      icon: "rhymes",
    },
  ];

  return (
    <div className={`Sidebar ${tab ? `has-tab` : ``}`}>
      <ul className="Sidebar__nav">
        {tabs.map(({ slug = "", title = "", icon = "" }, i) => (
          <li className={slug === tab ? "is-active" : ""} key={"tab--" + i}>
            <div
              className="click"
              onClick={(e) => setTab(slug === tab ? false : slug)}
            >
              <SvgLib svg={icon} />
            </div>
          </li>
        ))}
      </ul>
      {tab === "files" && (
        <div className="Sidebar__tab">
          <ul>
            {filesData.map((file, i) => (
              <li
                className={activeIndex === i ? "is-active" : ""}
                key={"files--" + i}
              >
                <div className="click" onClick={(e) => changeFile(i)}>
                  {file.title}
                </div>
              </li>
            ))}
          </ul>
          <div className="Sidebar__newFile">
            {newEntry && (
              <form onSubmit={(e) => clickNewEntry(e)}>
                <input
                  ref={inputNewEntry}
                  autoFocus
                  type="text"
                  placeholder="File name"
                />
              </form>
            )}
            <div className="click" onClick={(e) => setNewEntry(!newEntry)}>
              {newEntry ? "Close" : "New file"}
            </div>
          </div>
        </div>
      )}
      {tab === "rhymes" && (
        <div className="Sidebar__tab">
          <div className="Sidebar__rhymes">
            <input
              ref={inputRhymes}
              autoFocus
              type="text"
              placeholder="Word"
              onChange={(e) => newRhyme()}
            />
          </div>

          <ul>
            {rhymesArray.map(({ word = "" }, i) => (
              <li key={"rhymeArray--" + i}>
                <div>{word}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
