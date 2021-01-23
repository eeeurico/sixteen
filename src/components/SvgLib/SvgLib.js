import { svgLibrary } from "utils/utils";

const SvgLibrary = ({ svg = false, className = "", style = "" }) => {
  const svgItem = svgLibrary[svg] ? svgLibrary[svg] : false;
  const shape = svgItem.inner ? svgItem.inner : false;

  return (
    <svg
      {...{
        className: className,
        viewBox: svgItem.viewBox ? svgItem.viewBox : `0 0 120 120`,
        style: { ...style },
      }}
    >
      {!shape ? "" : typeof shape !== `string` ? shape : <path d={shape} />}
    </svg>
  );
};

export default SvgLibrary;
