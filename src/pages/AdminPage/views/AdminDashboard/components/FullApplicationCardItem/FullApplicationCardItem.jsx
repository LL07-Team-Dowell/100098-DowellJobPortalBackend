import Avatar from "react-avatar";
import styles from './styles.module.css';
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Overlay from "../../../../../../components/Overlay";
import { AiOutlineClose } from "react-icons/ai";

export default function FullApplicationCardItem({ application, activeStatus }) {
    const [ showEditOptions, setShowEditOptions ] = useState(false);
    const [ showEditModal, setShowEditModal ] = useState(false);
    const [ itemBeignEdited, setItemBeingEdited ] = useState(null);

    useEffect(() => {
        setItemBeingEdited(application)
    }, [application])

    const handleUpdateItemClick = () => {
        setShowEditOptions(false);
        setShowEditModal(true);
    }
    return <>
        <div className={styles.full__Application__Item}>
            <div className={styles.edit__App} onClick={() => setShowEditOptions(!showEditOptions)}>
                <HiOutlineDotsVertical />
            </div>
            <div>
                <Avatar 
                    name={application.applicant.slice(0, 1) + ' ' + application.applicant.split(' ')[application.applicant.split(' ').length - 1]?.slice(0, 1)}
                    round={true}
                    size="5rem"
                />
            </div>
            <div className={styles.detail}>
                <h2>{application.applicant}</h2>
                <p>{application.job_title}</p>
            </div>
            <div className={activeStatus ? styles.active : styles.inactive}>
                <p>
                    {
                        activeStatus ? 
                            'Active' 
                        :
                            'Inactive'
                    }
                </p>
            </div>
            <div className={styles.applicant__Details}>
                <p>Email: {application.applicant_email}</p>
                <p>Country: {application.country}</p>
                <p>Current Status: {application.status}</p>
                {
                    application.project && Array.isArray(application.project) && 
                    <p>Project: {application.project[0]}</p>
                }
            </div>
            {
                showEditOptions && <ul className={styles.update__Listing}>
                    <li className={styles.item} onClick={handleUpdateItemClick}>Update</li>
                    <li className={styles.delete} onClick={() => toast.info('feature in development')}>Delete</li>
                </ul>
            }
            {
                showEditModal && <Overlay>
                    <div className={styles.edit__Modal}>
                        <AiOutlineClose 
                            onClick={() => setShowEditModal(false)} 
                            className={styles.edit__Icon}
                        />
                        <h2>Edit Application for {itemBeignEdited?.applicant}</h2>
                    </div>
                </Overlay>
            }
        </div>
    </>
}