import React from "react";

export const svgLibrary = {
  files: {
    viewBox: `0 0 24 24`,
    inner: (
      <g>
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />{" "}
      </g>
    ),
  },
  rhymes: {
    viewBox: `0 0 24 24`,
    inner: (
      <g>
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
      </g>
    ),
  },
  pause: {
    viewBox: `0 0 24 24`,
    inner: (
      <g>
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
      </g>
    ),
  },
  play: {
    viewBox: `0 0 24 24`,
    inner: (
      <g>
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M8 5v14l11-7z" />
      </g>
    ),
  },
};
