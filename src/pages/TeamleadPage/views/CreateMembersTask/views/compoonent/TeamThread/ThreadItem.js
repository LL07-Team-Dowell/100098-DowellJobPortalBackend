import styled from '@emotion/styled';
import React from 'react';
import TeamScreenThreads from '../teamScreenThreads/teamScreenThreads';
import { useCurrentUserContext } from '../../../../../../../contexts/CurrentUserContext';
import { FaRegComments } from 'react-icons/fa';

const Wrapper = styled.div`
display: flex;
flex-direction: column;
align-items: left !important;


.outside-containre{
    width: 80%;
    margin: auto;
}
.header-items {
    display: flex;
    width: 20rem;
    justify-content: space-around;
    margin-top: 1rem;
}

.team-screen-threads {
    width: 80%;
    margin: auto;
    padding: 50px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
  
  .team-screen-threads-card {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
  }
  
  .team-screen-threads-details {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2% 3%;
  }
  
  .team-screen-threads-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    line-height: 2rem;
  }
  
  .team-screen-threads-container p {
    font-size: 1rem;
    /* font-weight: 600; */
    color: #000;
  }
  
  .team-screen-threads-progress {
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 1rem;
  }
  
  .progress {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 0.3rem;
  }
  
  .progress p {
    font-size: 0.8rem;
    font-weight: 600;
  }

  .threads-created{
    background-color: #005734;
    width: 50%;
    height: 50%;
    padding: 1rem;
    border-radius: 50%;
    cursor: pointer;

  }
  
  .threads-progress {
    width: 40%;
    height: 40%;
    background-color: red;
    padding: 1rem;
    border-radius: 50%;
    cursor:pointer;
  }
  
  .comments-section {
    cursor: pointer;
  }
  
  .comments {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .comments span {
    font-size: 0.8rem;
    font-weight: 600;
    color: #838383;
  }
  
  .comments-section svg {
    font-size: 1.8rem;
  }
  
`

const ThreadItem = () => {
    const { currentUser } = useCurrentUserContext();

    return (
        <Wrapper>
            <div className="outside-containre">
                <div className="section">
                    <div className="header-items">
                        <h3>In progresds</h3>
                        <h3>Completed</h3>
                    </div>
                </div>

            </div>
            <div>
                <div className="team-screen-threads">
                    <div className="team-screen-threads-card">
                        <div className="team-screen-threads-details">
                            <div>
                                <img src="https://picsum.photos/id/237/500/300" alt="" />
                            </div>
                            <div className="team-screen-threads-container">
                                <p>Fixed the Login button</p>
                                <div>
                                    <p>Assigned to :</p>
                                    <p>Raised by : </p>
                                </div>
                                <div className="team-screen-threads-progress">
                                    <div className="progress">
                                        <p>Created</p>
                                        <div className="threads-created"></div>
                                    </div>
                                    <div className="progress">
                                        <p>In progress</p>
                                        <div className="threads-progress"></div>
                                    </div>
                                    <div className="progress">
                                        <p>Completed</p>
                                        <div className="threads-progress"></div>
                                    </div>
                                    <div className="progress">
                                        <p>Resolved</p>
                                        <div className="threads-progress"></div>
                                    </div>
                                </div>
                                <div className="comments-section">
                                    <p className="comments">
                                        <FaRegComments />
                                        &bull; <span>10 Comments</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}

export default ThreadItem;
