import React from "react";
import { AiFillFilePdf, AiOutlineCamera, AiOutlineClose } from "react-icons/ai";
import "./ReportCapture.scss";
import Overlay from "../Overlay";
const ReportCapture = ({
  htmlToCanvaFunction,
  htmlToPdfFunction,
  closeModal,
}) => {
  return (
    <Overlay>
      <div className='report__capture'>
        <button
          className='close__btn'
          onClick={() => {
            closeModal();
          }}
        >
          <AiOutlineClose />
        </button>
        <div>
          <div className='' onClick={htmlToCanvaFunction}>
            <div>
              <AiOutlineCamera />
            </div>
            <p>Screenshot</p>
          </div>
          <div className='' onClick={htmlToPdfFunction}>
            <div>
              <AiFillFilePdf />
            </div>
            <p>PDF</p>
          </div>
        </div>
      </div>
    </Overlay>
  );
};

export default ReportCapture;
