import illus from '../../../../assets/images/web-error.jpg';
import styles from './styles.module.css';
import logo from '../../../../assets/images/landing-logo.png';
import { Link } from 'react-router-dom';
import { uxlivingLabURL } from '../../../../utils/utils';

const CandidateRemovedScreen = () => {
    return <>
        <div className={styles.wrapper}>
            <img 
                src={logo} 
                alt='logo'
                className={styles.logo}
                onClick={
                    () => window.location.replace(uxlivingLabURL)
                }
            />
            <img 
                src={illus}
                alt="illustration"
                className={styles.illus}
            />
            <h2>You are no longer part of DoWell UX Living Lab</h2>
            <p>Thank you for your services, We have discontinued your contract</p>
            <Link
                className={styles.btn}
                to={'mailto:zoyaa4840@gmail.com'}
            >
                Send mail to HR
            </Link>
        </div>
    </>
}

export default CandidateRemovedScreen