import { useEffect, useState } from "react";
import "./progressTracker.css";

const ProgressTracker = ({ durationInSec }) => {
  const [progressVal, setProgressVal] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setProgressVal((prevVal) => prevVal + 1),
      (durationInSec * 1000) / 1000
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

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
