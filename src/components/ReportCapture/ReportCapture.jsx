import React from "react";
import { AiFillFilePdf, AiOutlineCamera, AiOutlineClose } from "react-icons/ai";
import { FaFileExcel } from "react-icons/fa";
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
              <FaFileExcel />
            </div>
            <p>Excel</p>
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
