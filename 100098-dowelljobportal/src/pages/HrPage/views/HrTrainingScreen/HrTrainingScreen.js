import React from "react";
import "./Hr_TrainingScreen.css";
import { ReactComponent as Frontend } from "./assets/system3.svg";
import { ReactComponent as Ux } from "./assets/ux-design-1.svg";
import { ReactComponent as Backend } from "./assets/database-1.svg";
import HrTrainingScreenCard from "./Hr_TrainingScreenCard";

function HrTrainingScreen() {
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
          <HrTrainingScreenCard title="Front-end" />
        </div>
        <div className="training__cards">
          <div className="svg_component">
            <Backend />
          </div>
          <HrTrainingScreenCard title="Back-end" />
        </div>
        <div className="training__cards">
          <div className="svg_component">
            <Ux />
          </div>
          <HrTrainingScreenCard title="UI/UX" />
        </div>
      </div>
    </div>
  );
}

export default HrTrainingScreen;
