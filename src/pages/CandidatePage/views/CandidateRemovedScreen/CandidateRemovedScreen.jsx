import illus from '../../../../assets/images/403-forbidden.jpg';
import styles from './styles.module.css';


const CandidateRemovedScreen = () => {
    return <>
        <div className={styles.wrapper}>
            <img 
                src={illus}
                alt="illustration"
            />
            <h2>Thank you for service</h2>
            <p>We have discontinued your contract</p>
        </div>
    </>
}

export default CandidateRemovedScreen