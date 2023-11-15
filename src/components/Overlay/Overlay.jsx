import React from "react";
import "./Overlay.scss";
const Overlay = ({ children, className }) => {
  return <div className={`${className ? className + ' ' : ''}overlay`}>{children}</div>;
};

export default Overlay;
