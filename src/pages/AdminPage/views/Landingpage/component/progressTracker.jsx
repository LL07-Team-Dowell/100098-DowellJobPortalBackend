import { useEffect, useState } from "react";
import "./progressTracker.css";

const ProgressTracker = ({ durationInSec, showDivProgressBar, progressClassName }) => {
  const [progressVal, setProgressVal] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setProgressVal((prevVal) => {
        if (prevVal <= 100) return prevVal + 1;
        return prevVal;
      }),
      (durationInSec * 1000) / 1000
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (showDivProgressBar) return <>
    <div
      style={{ width: `${progressVal <= 100 ? progressVal : '100'}%` }}
      className={`${progressClassName ? progressClassName : ''} ' progress__bar'`}
    >
      <span>{progressVal <= 100 ? progressVal : '100'}%</span>
    </div>
  </>

  return (
    <>
      <div className="tracker__container">
        <p className="track__head">Please wait...</p>
        <progress
          value={progressVal}
          max={100}
          className="progress__bar"
        ></progress>
      </div>
    </>
  );
};

export default ProgressTracker;
