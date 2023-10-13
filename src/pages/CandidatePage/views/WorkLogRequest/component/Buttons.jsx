import React, { useState } from "react";

const Buttons = ({ changeCardsStats }) => {
  const [button, setButton] = useState(0);

  return (
    <div className='btns__work_log_request'>
      <button
        className={button === 1 && "active"}
        onClick={() => {
          changeCardsStats("pending-approved");
          setButton(1);
        }}
      >
        pending approved
      </button>
      <button
        className={button === 2 && "active"}
        onClick={() => {
          changeCardsStats("approved");
          setButton(2);
        }}
      >
        approved
      </button>
      <button
        className={button === 3 && "active"}
        onClick={() => {
          changeCardsStats("denied");
          setButton(3);
        }}
      >
        denied
      </button>
    </div>
  );
};

export default Buttons;
