import { AiOutlineRight } from 'react-icons/ai';
import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';
import skeletonStyles from '../../styles/skeleton.module.css';


const MainStatCard = ({ 
    data, 
    dataLoading, 
    dataLoaded, 
    title, 
    icon, 
    action,
    locationState,
}) => {
    const navigate = useNavigate();

    return <>
        <div className={styles.main__Stat}>
            <div className={styles.stat__Icon__Wrap}>
                {icon}
            </div>
            <div className={styles.stat__Info__Wrap}>
                <div className={styles.stat__Info}>
                    <p className={styles.title}>
                        {title}
                    </p>
                    <p className={`${styles.count} ${dataLoading ? skeletonStyles.skeleton : ''}`}>
                        {
                            dataLoading ? <></> :
                            dataLoaded ? 
                                !data ? 0 
                                :
                                Number(data).toLocaleString()
                            :
                            0
                        }
                    </p>
                </div>
                {
                    action && 
                    <button 
                        onClick={
                            dataLoading ? 
                                () => {} 
                            : 
                            () => navigate(action, locationState ? { state: { [locationState]: true }} : {})
                        }
                    >
                        <span>View</span>
                        <AiOutlineRight />
                    </button>
                }
            </div>
        </div>
    </>
}

export default MainStatCard;
