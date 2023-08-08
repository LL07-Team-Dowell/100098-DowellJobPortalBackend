import { Rating } from '@mui/material';
import { formatDateAndTime, validateUrl } from '../../../../../helpers/helpers';
import styles from './style.module.css';
import { IoMdClose } from 'react-icons/io';


const SubmitResponseModal = ({ closeModal, submitBtnDisabled, handleSubmitBtnClick, handleInputChange, inputValues, inputValuesAreReadOnly, isHrView }) => {
    const handleInputClick = (itemLink) => {
        if (!itemLink || !validateUrl(itemLink)) return
        window.open(itemLink, '_blank');
    }

    return <>
        <div className={styles.modal__Overlay}>
            <div className={styles.modal__Container}>
                <   div className={styles.close__Container} onClick={submitBtnDisabled ? () => { } : () => closeModal()}>
                    <IoMdClose />
                </div>
                <h3 className={styles.header}>
                    <span>
                        {
                            inputValuesAreReadOnly ?
                                isHrView ?
                                    "Candidate response"
                                    :
                                    "Your response"
                                :
                                "Submit training"
                        }
                    </span>
                    {
                        inputValuesAreReadOnly &&
                        inputValues?.submitted_on &&
                        <>
                            <span className={styles.submitted__Date__Span}>Submitted . {formatDateAndTime(inputValues?.submitted_on, true)}</span>
                            {
                                inputValues?.rating && <Rating
                                    name="read-only"
                                    value={inputValues?.rating}
                                    readOnly
                                />
                            }
                        </>
                    }
                </h3>
                <label className={styles.label} htmlFor="input_1" onClick={inputValuesAreReadOnly ? () => handleInputClick(inputValues?.answer_link) : () => { }}>
                    <span>Link to Answer {isHrView ? <></> : <span className={styles.required}>*</span>}</span>
                    <input
                        name={"answer_link"}
                        value={inputValues?.answer_link}
                        id="input_1"
                        type='text'
                        onChange={({ target }) => handleInputChange(target.name, target.value)}
                        readOnly={inputValuesAreReadOnly}
                        className={inputValuesAreReadOnly && inputValues?.answer_link ? styles.hrViewInput : ''}
                    />
                    {inputValuesAreReadOnly && inputValues?.answer_link && <span className={styles.view__Text}>View</span>}
                </label>
                <label className={styles.label} htmlFor="input_4" onClick={inputValuesAreReadOnly ? () => handleInputClick(inputValues?.video_link) : () => { }}>
                    <span>Link to Explaining Video {isHrView ? <></> : <span className={styles.required}>*</span>}</span>
                    <input
                        name={"video_link"}
                        value={inputValues?.video_link}
                        id="input_4"
                        type='text'
                        onChange={({ target }) => handleInputChange(target.name, target.value)}
                        readOnly={inputValuesAreReadOnly}
                        className={inputValuesAreReadOnly && inputValues?.video_link ? styles.hrViewInput : ''}
                    />
                    {inputValuesAreReadOnly && inputValues?.video_link && <span className={styles.view__Text}>View</span>}
                </label>
                <label className={styles.label} htmlFor="input_2" onClick={inputValuesAreReadOnly ? () => handleInputClick(inputValues?.code_base_link) : () => { }}>
                    <span>Link to Codebase</span>
                    <input
                        name={"code_base_link"}
                        value={inputValues?.code_base_link}
                        id="input_2"
                        type='text'
                        onChange={({ target }) => handleInputChange(target.name, target.value)}
                        readOnly={inputValuesAreReadOnly}
                        className={inputValuesAreReadOnly && inputValues?.code_base_link ? styles.hrViewInput : ''}
                    />
                    {inputValuesAreReadOnly && inputValues?.code_base_link && <span className={styles.view__Text}>View</span>}
                </label>
                <label className={styles.label} htmlFor="input_3" onClick={inputValuesAreReadOnly ? () => handleInputClick(inputValues?.documentation_link) : () => { }}>
                    <span>Link to Documentation</span>
                    <input
                        name={"documentation_link"}
                        value={inputValues?.documentation_link}
                        id="input_3"
                        type='text'
                        onChange={({ target }) => handleInputChange(target.name, target.value)}
                        readOnly={inputValuesAreReadOnly}
                        className={inputValuesAreReadOnly && inputValues?.documentation_link ? styles.hrViewInput : ''}
                    />
                    {inputValuesAreReadOnly && inputValues?.documentation_link && <span className={styles.view__Text}>View</span>}
                </label>
                {
                    !inputValuesAreReadOnly &&
                    <button
                        className={styles.btn}
                        disabled={submitBtnDisabled}
                        onClick={handleSubmitBtnClick}
                    >
                        {
                            submitBtnDisabled ?
                                'Please wait...' :
                                'Submit'
                        }
                    </button>
                }
                {
                    isHrView &&
                    <button
                        className={styles.btn}
                        disabled={submitBtnDisabled}
                        onClick={handleSubmitBtnClick}
                    >
                        {
                            submitBtnDisabled ?
                                'Please wait...' :
                            inputValues.rating ?
                                'Edit rating' :
                                'Rate user'
                        }
                    </button>
                }
            </div>
        </div>
    </>
}

export default SubmitResponseModal;
