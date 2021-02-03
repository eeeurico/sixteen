import React, { useRef, useState } from "react";
import rhymes from "rhymes";
import { SvgLib, Metronome } from "components/components";

const Header = ({
  tab,
  setTab,
  switchMode,
  mode,
  showTabs = false,
  title = false,
}) => {
  const inputCopy = useRef(null);
  // const inputNewEntry = useRef(null);
  const inputRhymes = useRef(null);
  //
  // const [newEntry, setNewEntry] = useState(false);
  const [rhymesArray, setRhymesArray] = useState([]);

  // //
  // const clickNewEntry = (e) => {
  //   e.preventDefault();
  //   const newEntryName = inputNewEntry.current.value;
  //   if (!newEntryName) return;
  //   newFile(newEntryName);
  //   setNewEntry(false);
  // };

  const newRhyme = (e) => {
    e.preventDefault();
    const newRhymeValue = inputRhymes.current.value;
    setRhymesArray(newRhymeValue ? rhymes(newRhymeValue) : []);
  };

  const copyText = (word) => {
    var tempInput = document.createElement("INPUT");
    inputCopy.current.appendChild(tempInput);
    tempInput.setAttribute("value", word);
    tempInput.select();
    document.execCommand("copy");
    inputCopy.current.removeChild(tempInput);
  };

  const tabs = showTabs
    ? [
        {
          title: "r",
          slug: "rhymes",
          icon: "rhymes",
        },
        {
          title: "s",
          slug: "settings",
          icon: "settings",
        },
      ]
    : [];

  return (
    <div className={`Header ${tab ? `has-tab` : ``}`}>
      <div className={"Header__title"}>{title ? title + " — " : ""}Sixteen</div>

      <ul className="Header__nav">
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

      {showTabs && <Metronome />}

      <div className={`Header__tab ${tab === "rhymes" ? "is-active" : ""}`}>
        <div className="Header__tab-inner">
          <div className="Header__rhymes">
            <form onSubmit={(e) => newRhyme(e)}>
              <input
                ref={inputRhymes}
                autoFocus
                type="text"
                placeholder="Word"
              />
            </form>
          </div>

          <ul ref={inputCopy}>
            {rhymesArray.map(({ word = "" }, i) => (
              <li key={"rhymeArray--" + i}>
                <div onClick={(e) => copyText(word)}>{word}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className={`Header__tab Header__tab--settings ${
          tab === "settings" ? "is-active" : ""
        }`}
      >
        <div className="Header__tab-inner">
          <ul>
            <li className="--title">
              <div>Settings</div>
            </li>
            <li className={mode === "dark" ? "is-active" : ""}>
              <div onClick={(e) => switchMode("dark")}>Dark mode</div>
            </li>
            <li className={mode === "light" ? "is-active" : ""}>
              <div onClick={(e) => switchMode("light")}>Light mode</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
