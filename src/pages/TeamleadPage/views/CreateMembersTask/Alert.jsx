import { useState } from "react";
import {MdOutlineDone} from 'react-icons/md'
function Alert({message}) {
  const [active, setActive] = useState(true);
  const [timer1, setTimer1] = useState(null);
  const [timer2, setTimer2] = useState(null);

  function handleClose() {
    setActive(false);
    clearTimeout(timer1);
    clearTimeout(timer2);
  }

  return (
    <>
      <div style={{width:"400px"}} className={`toast ${active ? "active" : ""}`}>
        <div className="toast-content">
          <i className="fas fa-solid fa-check check"> <MdOutlineDone/></i>
          <div className="message">
            <span className="text text-1">Success</span>
            <span className="text text-2">{message}</span>
          </div>
        </div>
        <div className={`progress ${active ? "active" : ""}`}></div>
      </div>
    </>
  );
}

export default Alert;