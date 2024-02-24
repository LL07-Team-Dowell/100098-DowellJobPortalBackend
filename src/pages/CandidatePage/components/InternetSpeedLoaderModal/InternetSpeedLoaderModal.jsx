import React, { useEffect, useState } from "react";
import InternetLoader from "../../../../components/InternetLoader/InternetLoader";
import Overlay from "../../../../components/Overlay/Overlay";
import styles from "./styles.module.css";
import { MdCheck } from "react-icons/md";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { AiOutlineCheckCircle, AiOutlineClose } from "react-icons/ai";

const steps = [
    {
        text: 'Connecting to server...',
        duration: 2,
    },
    {
        text: 'Checking download speed',
        duration: 12,
    },
    {
        text: 'Checking upload speed',
        duration: 22,
    },
    {
        text: 'Calculating result',
        duration: 30,
    },
];

let indexTrack = 0;
let timer = 0;

const InternetSpeedLoaderModal = ({ speedResult, closeModal, handleRetakeTest }) => {
    const [ currentIndex, setCurrentIndex ] = useState(0);
    const [ finished, setFinished ] = useState(false);
    const [ numberOfTimesTestTaken, setNumberOfTImesTestTaken ] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(indexTrack);

            for (let i = 0; i < steps.length; i++) {
                const element = steps[i];
                if (timer > element?.duration && i === indexTrack) {
                    indexTrack += 1;
                }
            }

            timer += 1;

        }, 1000);

        return () => {
            clearInterval(interval);
        }
    }, [])

    useEffect(() => {
        if (
            !finished && (
                currentIndex >= steps.length || 
                (speedResult !== null && typeof speedResult === 'object')
            )
        ) {
            setFinished(true);
        }

    }, [currentIndex, speedResult, finished])

    const restartTest = () => {
        indexTrack = 0;
        timer = 0;
        setCurrentIndex(0);
        setFinished(false);
        setNumberOfTImesTestTaken(numberOfTimesTestTaken + 1);

        if (handleRetakeTest && typeof handleRetakeTest === 'function') handleRetakeTest();
    }

    return <>
        <Overlay>
            <div className={styles.modal__Wrap}>
                <h2>
                    {
                        finished ? 
                            'Speed results' 
                        :
                            'Internet Speed Test'
                    }
                    {
                        finished && <AiOutlineClose 
                            onClick={
                                closeModal &&
                                typeof closeModal === 'function' ?
                                    () => closeModal()
                                :
                                () => {}
                            }
                            style={
                                {
                                    cursor: 'pointer',
                                }
                            }
                        />
                    }
                </h2>
                {
                    finished ? <>
                        <AiOutlineCheckCircle 
                            fontSize={'5rem'}
                        />
                        <div>
                            <p className={styles.result__Item}>Your download speed is {speedResult?.download}</p>
                            <p className={styles.result__Item}>Your upload speed is {speedResult?.upload}</p>
                        </div>
                    </> :
                    <>
                        <InternetLoader />
                        <div className={styles.progress_Wrap}>
                            {
                                React.Children.toArray(steps.map((step, index) => {
                                    return <div className={styles.progress_item}>
                                        <div
                                            className={`
                                            ${styles.indicator}
                                            ${
                                                index === currentIndex ?
                                                    ''
                                                :
                                                index < currentIndex ? styles.completed_Indicator :
                                                styles.pending_Indicator
                                            }`}
                                        >
                                            {
                                                index === currentIndex ?
                                                    <LoadingSpinner 
                                                        width={'1rem'}
                                                        height={'1rem'}
                                                    />
                                                :
                                                index < currentIndex ?
                                                    <MdCheck color="#fff" />
                                                :
                                                <></>
                                            }
                                        </div>
                                        <p>{step.text}</p>
                                    </div>
                                }))
                            }
                        </div>
                    </>
                }
                {
                    finished && <button
                        className={styles.retake__Test__Btn}
                        onClick={restartTest}
                    >
                        Retake
                    </button>
                }
            </div>
        </Overlay>
    </>
}

export default InternetSpeedLoaderModal;