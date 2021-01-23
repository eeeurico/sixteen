import React, { useState } from "react";
import syllable from "syllable";

const Main = ({ file = "", setLoadedFile = undefined }) => {
  const [lines, setLines] = useState(file.split(/\n/g));

  const handleChange = (event) => {
    setLoadedFile(event.target.value);
    setLines(event.target.value.split(/\n/g));
  };

  return (
    <div className="Main">
      <div className="Main__main">
        <textarea
          className="Main__textarea"
          value={file}
          onChange={handleChange}
        />
        <div className="Main__preview">
          {lines.map((line, i) => (
            <div key={"syllable--" + i}>
              <div className="Main__line">{i + 1}</div>
              {line}
              <div className="Main__syllable">{syllable(line)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Main;
