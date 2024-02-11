import { AiOutlineCheck } from "react-icons/ai";
import styles from './styles.module.css';


export default function CheckboxItem ({
    label, 
    checked,
    handleSelectItem,
}) {
    return <>
        <div 
            className={styles.checkbox__item}
            onClick={
                handleSelectItem && typeof handleSelectItem === 'function' ?
                    () => handleSelectItem(!checked)
                :
                () => []
            }
        >
            <div className={`${styles.checkbox} ${checked ? styles.checked : ''}`}>
                {
                    checked ? 
                        <AiOutlineCheck /> 
                    :
                    <></>
                }
            </div>
            <span>{label}</span>
        </div>
    </>
}