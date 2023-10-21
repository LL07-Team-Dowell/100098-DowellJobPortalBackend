import React from "react";
import { AiFillFilePdf, AiOutlineCamera, AiOutlineClose } from "react-icons/ai";
import { FaFileExcel } from "react-icons/fa";
import "./ReportCapture.scss";
import Overlay from "../Overlay";
const ReportCapture = ({
  htmlToCanvaFunction,
  htmlToPdfFunction,
  closeModal,
  handleExcelItemDownload,
  pdfBtnIsDisabled,
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
        <h2>Download</h2>
        <div>
          <div className='' onClick={handleExcelItemDownload}>
            <div>
              <FaFileExcel />
            </div>
            <p>Excel</p>
          </div>
          <div className='' onClick={pdfBtnIsDisabled ? () => {} : () => htmlToPdfFunction()}>
            <div>
              <AiFillFilePdf />
            </div>
            <p>
              {
                pdfBtnIsDisabled ? 'Please wait...'
                :
                'PDF'
              }
            </p>
          </div>
        </div>
      </div>
    </Overlay>
  );
};

export default ReportCapture;
