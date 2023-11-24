import { AiOutlinePlusCircle } from "react-icons/ai";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { TfiAgenda } from "react-icons/tfi";
import styles from './styles.module.css';
import { useNavigate } from "react-router-dom";


const GroupleadAgendaLanding = () => {
    const navigate = useNavigate();
    
    return <>
        <StaffJobLandingLayout
            teamleadView={true}
            isGrouplead={true}
            hideSearchBar={true}
        >
            <div className={styles.wrapper}>
              <h1>Weekly Agenda</h1> 

                <div className={styles.item__Box__Wrap}>
                    <div style={{ marginTop: 30 }} className="Create_Team" onClick={() => navigate('/new-agenda')}>
                        <div>
                            <div>
                                <AiOutlinePlusCircle
                                    className="icon"
                                    style={{ fontSize: "2rem" }}
                                />
                            </div>
                            <h4>Add New Agenda</h4>
                            <p>
                                Submit detailed agendas of what your team is intending to achieve for the week
                            </p>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }} className="Create_Team" onClick={() => navigate('/track-agenda')}>
                        <div>
                            <div>
                                <TfiAgenda
                                    className="icon"
                                    style={{ fontSize: "2rem" }}
                                />
                            </div>
                            <h4>Track Agendas</h4>
                            <p>
                                Track and monitor the progress of your weekly agendas.
                            </p>
                        </div>
                    </div>    
                </div>
                
            </div>
        </StaffJobLandingLayout>
    </>
}

export default GroupleadAgendaLanding;