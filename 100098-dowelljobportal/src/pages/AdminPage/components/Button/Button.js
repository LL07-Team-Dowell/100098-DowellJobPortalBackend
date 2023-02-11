import "./style.css";

const Button = ({ handleClick, icon, text, isDisabled, className }) => {
    return <button className={`add__Btn ${className ? className : ''} `} type="button" onClick={handleClick} disabled={isDisabled}>
        {icon && <>{icon}</>}
        {text && <>{text}</>}
    </button>
}

export default Button;