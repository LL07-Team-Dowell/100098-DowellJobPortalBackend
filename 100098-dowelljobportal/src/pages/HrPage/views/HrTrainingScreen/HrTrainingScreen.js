import React, { useEffect, useState } from "react";
import "./Hr_TrainingScreen.css";
import { ReactComponent as Frontend } from "./assets/system3.svg";
import { ReactComponent as Ux } from "./assets/ux-design-1.svg";
import { ReactComponent as Backend } from "./assets/database-1.svg";
import HrTrainingScreenCard from "./Hr_TrainingScreenCard";

function HrTrainingScreen() {
const [loading, setLoading] = useState(false);

  //   const handleSend = (e) => {};

  return (
    <div className="training__wrapper">
      <div className="training__header">
        <h1>Create Training Programs</h1>
      </div>
      <div className="training__container">
        <div className="training__cards">
          <div className="svg_component">
            <Frontend />
          </div>
          <HrTrainingScreenCard module="Front-end" />
        </div>
        <div className="training__cards">
          <div className="svg_component">
            <Backend />
          </div>
          <HrTrainingScreenCard module="Back-end" />
        </div>
        <div className="training__cards">
          <div className="svg_component">
            <Ux />
          </div>
          <HrTrainingScreenCard module="UI/UX" />
        </div>
        <div className="training__cards">
          <div className="svg_component">
            <Frontend />
          </div>
          <HrTrainingScreenCard module="Virtual Assistant" />
        </div>
        <div className="training__cards">
          <div className="svg_component">
            <Backend />
          </div>
          <HrTrainingScreenCard module="Web" />
        </div>
        <div className="training__cards">
          <div className="svg_component">
            <Ux />
          </div>
          <HrTrainingScreenCard module="Mobile" />
        </div>
      </div>
    </div>
  );
}

export default HrTrainingScreen;
