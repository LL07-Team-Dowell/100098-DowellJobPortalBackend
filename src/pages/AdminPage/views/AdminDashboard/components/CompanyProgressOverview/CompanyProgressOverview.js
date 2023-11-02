import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { Tooltip } from "react-tooltip";

export default function CompanyProgressOverview({ width, height, value, tooltipId, toolTipContent }) {
    return <>
        <div 
            style={{ width: width ? width : 170, height: height ? height : 170 }} 
            data-tooltip-id={tooltipId} 
            data-tooltip-content={toolTipContent}
        >
            <CircularProgressbar
                value={
                    Number(value).toFixed(2)
                } 
                text={`${Number(value).toFixed(2)}%`} 
                styles={
                    buildStyles({
                        pathColor: `#005734`,
                        textColor: '#005734',
                        trailColor: '#efefef',
                        backgroundColor: '#005734',
                    })
                }
            />
            <Tooltip id={tooltipId} />
        </div>
    </>
}