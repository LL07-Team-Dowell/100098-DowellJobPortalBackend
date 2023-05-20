import styles from './style.module.css';
import { IoMdClose } from 'react-icons/io';


const SubmitResponseModal = ({ closeModal, submitBtnDisabled, handleSubmitBtnClick, handleInputChange, inputValues }) => {

    return <>
        <div className={styles.modal__Overlay}>
            <div className={styles.modal__Container}>
            <   div className={styles.close__Container} onClick={submitBtnDisabled ? () => {} : () => closeModal()}>
                    <IoMdClose />
                </div>
                <h3 className={styles.header}>Submit training</h3>
                <label className={styles.label} htmlFor="input_1">
                    <span>Link to Answer <span className={styles.required}>*</span></span>
                    <input name={"answer_link"} value={inputValues.answer_link} id="input_1" type='text' onChange={({ target }) => handleInputChange(target.name, target.value)} />
                </label>
                <label className={styles.label} htmlFor="input_2">
                    <span>Link to Codebase</span>
                    <input name={"code_base_link"} value={inputValues.code_base_link} id="input_2" type='text' onChange={({ target }) => handleInputChange(target.name, target.value)} />
                </label>
                <label className={styles.label} htmlFor="input_3">
                    <span>Link to Documentation</span>
                    <input name={"documentation_link"} value={inputValues.documentation_link} id="input_3" type='text' onChange={({ target }) => handleInputChange(target.name, target.value)} />
                </label>
                <button className={styles.btn} disabled={submitBtnDisabled} onClick={handleSubmitBtnClick}>
                    Submit
                </button>
            </div>
        </div>
    </>
}

export default SubmitResponseModal;
