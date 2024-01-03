import { AiOutlineCheckCircle } from 'react-icons/ai';
import { MdOutlineCancel } from "react-icons/md";
import styles from './styles.module.css';


const SuccessPublicSubmissionModal = ({ handleBtnClick, btnDisabled, title, body, submissionModalIcon }) => {
    return <>
        <div className={styles.public__Overlay}>
            <div className={styles.public__Modal}>
                <div className={styles.top__Content}>
                    <h2>{title}</h2>
                    {submissionModalIcon ? <AiOutlineCheckCircle className={styles.icon} /> : <MdOutlineCancel className={styles.cancel} />}
                    <p>{body}</p>
                </div>
                <button 
                    className={styles.Btn}
                    onClick={handleBtnClick && typeof handleBtnClick === 'function' ? () => handleBtnClick() : () => {}}
                    disabled={btnDisabled}
                >
                    Visit site
                </button>  
            </div>
        </div>
    </>
}

export default SuccessPublicSubmissionModal;