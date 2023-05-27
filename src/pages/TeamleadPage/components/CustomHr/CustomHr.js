import "./style.css";

const CustomHr = ({ className }) => {
    return <hr className={`custom-hr ${className ? className : '' }`} />
}

export default CustomHr;
