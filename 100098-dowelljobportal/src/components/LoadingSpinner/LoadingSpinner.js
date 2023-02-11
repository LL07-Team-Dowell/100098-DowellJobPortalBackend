import "./style.css";


const LoadingSpinner = ({ color, marginLeft, marginRight, width, height }) => {
    const customSpinnerColor = {
        borderTopColor: color ? color : "#57A639",
        marginLeft: marginLeft ? marginLeft : "auto",
        marginRight: marginRight ? marginRight : "auto",
        width: width ? width : "3rem",
        height: height ? height : "3rem",
    }

    return <div id="loading" className="display" style={customSpinnerColor}></div>
}

export default LoadingSpinner;
