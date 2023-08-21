import React, { useState } from 'react'
import StaffJobLandingLayout from '../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout';
import Navbar from '../../TeamleadPage/views/CreateMembersTask/component/Navbar';
import { AiOutlineAim } from 'react-icons/ai';

const GroupLeadTask = () => {
    const [searchValue, setSearchValue] = useState('');

    return (
        <StaffJobLandingLayout teamleadView={true} searchValue={searchValue} setSearchValue={setSearchValue} searchTeam={true} isGrouplead={true}>
            <br />
            <Navbar title={"View Tasks"} color={'#005734'} noButtonBack={true} removeButton={true} />
            <div className="container">
                <div style={{ marginTop: 30 }} className="Create_Team">
                    <div>
                        <div>
                            <AiOutlineAim
                                className="icon"
                                style={{ fontSize: "2rem" }}
                            />
                        </div>
                        <h4>View All Team Tasks</h4>
                        <p>
                            View the progress on the resolution of issues raised by your team.
                        </p>
                    </div>
                </div>

                <div style={{ marginTop: 30 }} className="Create_Team">
                    <div>
                        <div>
                            <AiOutlineAim
                                className="icon"
                                style={{ fontSize: "2rem" }}
                            />
                        </div>
                        <h4>View Your Team Task</h4>
                        <p>
                            View the progress on the resolution of issues raised by your team.
                        </p>
                    </div>
                </div>

            </div>

        </StaffJobLandingLayout >
    )
}

export default GroupLeadTask;
