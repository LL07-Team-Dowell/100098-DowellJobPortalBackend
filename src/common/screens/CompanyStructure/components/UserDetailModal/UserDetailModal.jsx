import { AiOutlineClose } from "react-icons/ai";
import styles from "./styles.module.css";
import Avatar from "react-avatar";
import Overlay from "../../../../../components/Overlay";


export default function UserDetailModal ({
    applications=[],
    currentSelectedUser,
    handleCloseSingleUserModal,
}) {

    return <>
        <Overlay>
            <div className={styles.single__User__Detail}>
                <div 
                    className={styles.close__User__Detail} 
                    onClick={
                        handleCloseSingleUserModal && typeof handleCloseSingleUserModal === 'function' ?
                            () => handleCloseSingleUserModal()
                        :
                        () => {}
                    }
                >
                    <AiOutlineClose fontSize={'1.5rem'} />
                </div>
                
                <div className={styles.top__user__Info}>
                    <Avatar
                        name={
                            applications?.find(application => application.username === currentSelectedUser?.name)?.applicant ? 
                                applications?.find(application => application.username === currentSelectedUser?.name)?.applicant
                            :
                            currentSelectedUser?.name
                        }
                        round={true}
                        size='8rem'
                    />
                    <div>
                        <h5>
                            {
                                applications?.find(application => application.username === currentSelectedUser?.name)?.applicant ? 
                                    applications?.find(application => application.username === currentSelectedUser?.name)?.applicant
                                :
                                currentSelectedUser?.name
                            }
                        </h5>
                        <p className={styles.single__User__label} style={{ backgroundColor: currentSelectedUser?.labelColor}}>{currentSelectedUser?.title}</p>
                    
                    </div>
                </div>

                <div className={styles.user__Detail__Info__Wrap}>
                    <div className={styles.user__Detail__Info}>
                        <p>
                            Details
                            <div className={styles.highlight}></div>
                        </p>
                    </div>
                    <div className={styles.user__Project__Details}>
                        <p>Project: <span className={styles.user__Project__Detail__Item}>{currentSelectedUser?.project}</span></p>
                        <p>Subprojects: <span className={styles.user__Project__Detail__Item}>{currentSelectedUser?.subprojects?.join(', ')}</span></p>
                        <p>Team Members: <span className={styles.user__Project__Detail__Item}>
                                {currentSelectedUser?.members?.map(member => {
                                    if (applications?.find(application => application.username === member)?.applicant) return applications?.find(application => application.username === member)?.applicant;
                                    return member;
                                })?.join(', ')}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </Overlay>
    </>
}