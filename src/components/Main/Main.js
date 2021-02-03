import React, { useState, useEffect } from "react";
import syllable from "syllable";

const Main = ({ file = "", setLoadedFile = undefined, input }) => {
  const [lines, setLines] = useState(file.split(/\n/g));
  const [ignore, setIgnore] = useState(false);

  // Remember the latest callback.
  useEffect(() => {
    if (!ignore && input.current) {
      input.current.focus();
      setIgnore(true);
    }
  }, [ignore, input]);

  const handleChange = (event) => {
    setLoadedFile(event.target.value);
    setLines(event.target.value.split(/\n/g));
  };

  return (
    <div className={`Main`}>
      <div className="Main__main">
        <textarea
          className="Main__textarea"
          value={file}
          onChange={handleChange}
          ref={input}
        />
        <div className="Main__preview">
          {lines.map((line, i) => (
            <div key={"syllable--" + i}>
              {line && <div className="Main__line" />}
              {line}
              {line && <div className="Main__syllable">{syllable(line)}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Main;
