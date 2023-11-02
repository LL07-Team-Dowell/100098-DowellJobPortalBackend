import Avatar from 'react-avatar';
import styles from './styles.module.css';
import { Tooltip } from 'react-tooltip';
import skeletonStyles from '../../styles/skeleton.module.css';

export default function ApplicationCardItem({ application, loading, greyJobCardColor }) {
    return <div className={styles.application__item} 
        data-tooltip-content={loading ? '' : `${application?.applicant} from ${application?.country} applied for ${application?.job_title}`}
        data-tooltip-id={application?._id}
    >
        <div className={styles.profile__Wrap}>
            {
                loading ? 
                    <div className={`${skeletonStyles.skeleton} ${styles.profile}`}></div>
                :
                !application ? 
                    <></> 
                :
                <Avatar 
                    name={application.applicant}
                    className={styles.profile}
                    size='2rem'
                /> 
            }
            <div className={`${loading ? skeletonStyles.skeleton : ''} ${loading ? styles.detail__skeleton : ''} ${styles.detail}`}>
                <p>
                    {application?.applicant?.length > 16 ? application?.applicant?.slice(0, 16) + '...' : application?.applicant}
                </p>
                <p>
                    {application?.country}
                </p>
            </div>    
        </div>
        <div className={`${loading ? skeletonStyles.skeleton : ''} ${loading ? styles.job__skeleton : ''} ${styles.job}`} style={{ backgroundColor: greyJobCardColor ? '#f2f2f2' : 'rgb(225, 251, 226)' }}>
            <p>
                {application?.job_title}
            </p>
        </div>
        <Tooltip 
            id={application?._id}
            style={{ maxWidth: '8rem' }}
        />
    </div>
}