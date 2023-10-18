import React from "react";
import { AiOutlineCamera } from "react-icons/ai";

const ReportCapture = ({ htmlToCanvaFunction, htmlToPdfFunction }) => {
  return (
    <div className='report__capture'>
      <div className=''>
        <div>
          <AiOutlineCamera />
        </div>
        <p>Screenshot</p>
      </div>
      <div className=''>
        <div>
          <AiOutlineCamera />
        </div>
        <p>PDF</p>
      </div>
    </div>
  );
};

export default ReportCapture;
