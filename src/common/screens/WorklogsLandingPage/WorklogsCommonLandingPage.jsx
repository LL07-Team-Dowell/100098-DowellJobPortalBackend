import { ImStack } from 'react-icons/im';
import ItemFeatureCard from '../../components/ItemFeatureCard/ItemFeatureCard';
import styles from './styles.module.css';
import { RiFileList3Line } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';


export default function WorklogsCommonLandingPage({
    logRoute='',
    logRequestRoute='',
}) {
    const navigate = useNavigate();

    return <div className={styles.logs__Wrap}>
        <ItemFeatureCard 
            featureTitle={'Work Logs'}
            featureIcon={<ImStack />}
            handleFeatureCardClick={() => navigate(logRoute)}
            featureDescription={'View and approve work logs in your organization'}
        />
        <ItemFeatureCard 
            featureTitle={'Logs Requests'}
            featureIcon={<RiFileList3Line />}
            handleFeatureCardClick={() => navigate(logRequestRoute)}
            featureDescription={'View and approve log requests in your organization'}
        />
    </div>
}