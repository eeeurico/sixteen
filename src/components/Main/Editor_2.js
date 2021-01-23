import React, { useRef, useEffect } from "react";
import { convertToText, convertToMarkup } from "../../utils/utils";

const Editor = ({ value = "test", onValueChange = undefined }) => {
  return (
    <div className="Editor">
      <div className="Editor__main">
        <textarea
          className="Editor__textarea"
          ref={textarea}
          onChange={handleChange}
          value={file}
        />
        <div className="Editor__preview" ref={preview}></div>
      </div>
    </div>
  );
};

export default Editor;
