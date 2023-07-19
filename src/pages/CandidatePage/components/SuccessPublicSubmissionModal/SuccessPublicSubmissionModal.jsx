import { AiOutlineCheckCircle } from 'react-icons/ai';
import styles from './styles.module.css';


const SuccessPublicSubmissionModal = ({ handleBtnClick, btnDisabled }) => {
    return <>
        <div className={styles.public__Overlay}>
            <div className={styles.public__Modal}>
                <div className={styles.top__Content}>
                    <h2>Thank you for applying!</h2>
                    <AiOutlineCheckCircle className={styles.icon} />
                    <p>You can visit our website to learn more about our organization</p>
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