import React, { useEffect, useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io';
import styled from 'styled-components';
import * as assets from '../../../../assets/assetsIndex';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrentUserContext } from '../../../../contexts/CurrentUserContext';
import { FaRegUserCircle } from 'react-icons/fa';
import { getAllQuestions, getAllTrainingResponses } from '../../../../services/commonServices';
import { useResponsesContext } from '../../../../contexts/Responses';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import { createTrainingManagementResponse } from '../../../../services/hrTrainingServices';
import SubmitResponseModal from './SubmitResponseModal/SubmitResponseModal';
import { toast } from 'react-toastify';
import { candidateSubmitResponse } from '../../../../services/candidateServices';


function TraningProgress({ shorlistedJob }) {
    // console.log(shorlistedJob[0].shortlisted_on);
    const { currentUser } = useCurrentUserContext();
    const [complete, setComplete] = useState(false);
    const username = shorlistedJob[0]?.applicant;
    const shortlistedate = shorlistedJob[0].shortlisted_on;
    const date = new Date(shortlistedate);
    const formattedDate = date.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

    //Get All Questions
    const { responses, setresponses, allquestions, setAllQuestions } = useResponsesContext()
    const [uniqueItems, setUniqueItems] = useState([]);
    const uniqueTags = new Set();
    const [questionsLoading, setQuestionsLoading] = useState(true);
    const [submitInitialResponseLoading, setSubmitInitialResponseLoading] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false);
    const initialResponseStateObj = {
        "answer_link": "",
        "code_base_link": "",
        "documentation_link": "",
        "explaination_video_link": ""
    }
    const [submitDataToSend, setSubmitDataToSend] = useState(initialResponseStateObj);
    const [currentResponse, setCurrentResponse] = useState(null);
    const [formIsReadOnly, setFormIsReadOnly] = useState(false);

    //Question Link for view question
    const [questionsLink, setQuestionsLink] = useState('');
    const [showIframe, setShowIframe] = useState(false);
    const handleClose = () => {
        setShowIframe(false)
    }

    const handleViewQuestions = (event, link) => {
        event.preventDefault();
        setQuestionsLink(link);
        console.log(link);
        setShowIframe(true);
    };

    useEffect(() => {
        const fetchQuestions = async () => {
            if (shorlistedJob.length > 0) {
                const companyId = shorlistedJob[0].company_id;
                const response = await getAllQuestions(companyId);
                const allquestions = response.data.response.data;
                setAllQuestions(allquestions);
                if (responses.length > 10) return setQuestionsLoading(false);

                try {
                    const responsesData = await (await getAllTrainingResponses(currentUser?.portfolio_info[0]?.org_id)).data
                    setresponses(responsesData.response.data);
                } catch (error) {
                    console.log(error);
                }

                setQuestionsLoading(false);
            }
        };

        if (allquestions.length > 0) return setQuestionsLoading(false);
        fetchQuestions();
    }, [shorlistedJob]);

    useEffect(() => {
        if (allquestions.length > 0) {
            const updatedUniqueItems = [];
            uniqueTags.clear();

            allquestions.forEach((item) => {
                if (!uniqueTags.has(item.module)) {
                    uniqueTags.add(item.module);
                    updatedUniqueItems.push(item);
                }
            });

            setUniqueItems(updatedUniqueItems);
        }
    }, [allquestions]);


    const WrapperQna = styled.section`
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        padding: 0;
        .iframe-container {
        width: 80%; /* Adjust the width as needed */
        height: 500px; /* Adjust the height as needed */
        border: none; /* Remove iframe border */
        border-radius: 8px; /* Apply border radius for a rounded appearance */
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add a subtle box shadow */
        position: absolute;
        top: 20%;
    }
    
    iframe {
        width: 100%;
        height: 100%;
    }
  
`

    const Wrapper = styled.div`
        font-family:'poppins';
        background-color:#ffffff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: reletive;
    `

    const Section_1 = styled.div`
        font-family:'poppins';
        border-bottom: 1px solid #dfdddd;
        font-family:'poppins';
    `

    const Navbar = styled.nav`
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #dfdddd;
        padding: 0 16px;
        height: 5rem;
        background-color: white;
    `;

    const NavbarItem = styled.div`
        .item {
            display: flex;
            justify-content: space-around;
            align-items: center;


            h1{
                color:#005734;
            }

            input{
                padding: 15px 37px;
                width: 500px;
                background-color: #F5F5F5;
                border: none;
            }

            svg.svg {
                max-width: 100%;
                font-size: 20px;
                position: absolute;
                left: 10px;
            }

            svg{
                font-size: 28px;
                cursor: pointer;
                font-weight: 500;
                margin-right: 2.2rem;
                color: #7C7C7C;
            }

            .home{
                width: 100px;
                text-align: center;
                color: #7E7E7E;
                p{
                    font-size: 15px;
                }
            }

            .tranning{
                width: 100px;
                text-align: center;
                color: #7E7E7E;
                p{
                    font-size: 15px;
                }
            }
        }
    `;

    const Section_2 = styled.div`
        padding: 50px 76px;
        background-color:  #ffffff;
        border-bottom: 1px solid #dfdddd;
        position: relative;

        .left-content{
                display: flex;
                align-items: center;            

                svg{
                    font-size: 3rem;
                }


            .title{
                padding: 10px 10px;
                h2{
                    font-weight: 500;
                    text-transform: capitalize;
                }
                h3{
                    font-weight: 400;
                    font-size: 20px;
                }
            }
        }

        .bar-bottom {
            display: flex;
            position: absolute;
            bottom: 3px;
            left: 70px;

            .progress {
                border-bottom: 4px solid #005734;
                color: #005734;
                cursor: pointer;
                font-size: 18px;
            }

            .completed{
                color: #A3A1A1;
                cursor: pointer;
                font-size: 18px;
            }

            h5 {
                font-weight: 400;
                margin: 0 20px;
            }
        }
    `

    const Section_3 = styled.div`
        padding: 50px 76px;
        
        .view-question {
            color: #038953;
            border: 1px solid #038953;
            width: 190px;
            padding: 8px 20px;
            cursor: pointer;
            position: absolute;
            bottom: 0;
            left: 20rem;
            top: 8rem;
            height: 2.5rem;
        }

        .traning_section {
            display: flex;
            position: relative;
            .right-content{
                padding: 10px 30px;
                .traninning-program{
                    font-size: 18px;
                    color: #7E7E7E;
                    font-weight: 300;
                }

                h6 {
                    font-size: 21px;
                    font-weight: 600;
                }
                .content{
                    display: flex;
                    align-items: center;
                    
                    img{
                        height:50px;
                        width:50px;
                    }

                    .traninng-tag{
                        font-size: 18px;
                        color: #A6A6A6;
                        font-weight: 300;
                        margin-right: 10px;
                    }

                   
                }

                .right-bottom-content{
                    color: #038953;
                    border: 1px solid #038953;
                    width: 190px;
                    padding: 8px 20px;
                    cursor: pointer;
                }
            }

            .left-content{
                img {
                    height: 200px;
                }
            }


            .bottom-content {
                position: absolute;
                right: 3rem;
                bottom: 3rem;
                color: #038953;
                border: 1px solid #038953;
                padding: 6px 20px;
                cursor: pointer;
                font-size: 18px;
            }
        }
    `



    const nevigate = useNavigate();
    const nevigateButton = () => {
        nevigate(-1);
    }

    const createResp = (e, itemModule, itemQuestionLink) => {
        if (submitInitialResponseLoading) return

        const dataToPost = {
            company_id: currentUser.portfolio_info[0].org_id,
            data_type: currentUser.portfolio_info[0].data_type,
            username: currentUser.userinfo.username,
            started_on: new Date().toString(),
            module: itemModule
        }

        setSubmitInitialResponseLoading(true);

        createTrainingManagementResponse(dataToPost)
            .then(resp => {
                console.log(resp)
                setresponses([...responses, dataToPost]);
                setSubmitInitialResponseLoading(false);
                window.open(itemQuestionLink, '_blank');
            })
            .catch(err => {
                console.log(err)
                setSubmitInitialResponseLoading(false);
            })
    }

    const handleSubmitNowClick = (e, itemId, disableInputs = false) => {
        e.preventDefault();
        if (disableInputs) {
            setShowSubmitModal(true);
            setFormIsReadOnly(true);

            const currentResponses = responses.slice();
            const foundResponse = currentResponses.find(response => response._id === itemId);
            if (!foundResponse) return

            setSubmitDataToSend((prevValue) => {
                return {
                    ...prevValue,
                    "answer_link": foundResponse?.answer_link,
                    "code_base_link": foundResponse?.code_base_link,
                    "documentation_link": foundResponse?.documentation_link,
                    "explaination_video_link": foundResponse?.explaination_video_link
                }
            })
            return;
        }
        setShowSubmitModal(true);
        setCurrentResponse(itemId)
    }

    const handleSubmitResponse = async () => {
        if (submitDataToSend.answer_link.length < 1) return toast.info("Please enter the link to your answer");

        if (!currentResponse) return
        const currentResponses = responses.slice();
        const foundResponseIndex = currentResponses.findIndex(response => response._id === currentResponse);
        if (foundResponseIndex === -1) return

        setSubmitBtnDisabled(true);

        try {

            const res = (await candidateSubmitResponse(submitDataToSend)).data;
            const updatedResponse = { ...currentResponses[foundResponseIndex], ...submitDataToSend, submitted_on: new Date() };
            currentResponses[foundResponseIndex] = updatedResponse;
            setresponses(currentResponses);
            toast.success("Successfully submitted training response!");
            setSubmitDataToSend(initialResponseStateObj);

        } catch (error) {
            console.log(error);
        }

        setSubmitBtnDisabled(false);
        setCurrentResponse(null);
        setShowSubmitModal(false);
    }

    const handleCloseResponseModal = () => {
        setShowSubmitModal(false);
        setCurrentResponse(null);
        setFormIsReadOnly(false);
        setSubmitDataToSend(initialResponseStateObj);
    }

    return (
        <>
            <Section_1>
                <Navbar>
                    <NavbarItem>
                        <div className="item">
                            <IoIosArrowBack onClick={nevigateButton} />
                            <h1>My Training</h1>
                        </div>
                    </NavbarItem>
                </Navbar>
            </Section_1>
            <Wrapper>
                <Section_2>
                    <div className="left-content">
                        {/* <img src={assets.dev_img} alt="dev" /> */}
                        <FaRegUserCircle />
                        <div className="title">
                            <h2>Welcome back, {username}!</h2>
                            <h3>Candidate</h3>
                        </div>
                    </div>
                    <div className="right-content">

                    </div>
                    <div className="bar-bottom">
                        <div className={complete ? "completed" : "progress"}>
                            <h5 onClick={() => setComplete(false)}>In Progress</h5>
                        </div>
                        <div className={complete ? "progress" : "completed"}>
                            <h5 onClick={() => setComplete(true)}>Completed</h5>
                        </div>
                    </div>
                </Section_2>

                <Section_3>

                    {
                        questionsLoading ? <LoadingSpinner /> :
                            complete ? <>
                                {
                                    // React.Children.toArray(responses.filter((response) => response.submitted_on && response.username === currentUser.userinfo.username).map(response => {
                                    //     return <>
                                    //         <div className="traning_section">
                                    //             <div className="left-content">
                                    //                 <img src={assets.frontendimage} alt="frontend" />
                                    //             </div>
                                    //             <div className="right-content">
                                    //                 <span className='traninning-program'>Training Program</span>
                                    //                 <h6>Become a {response.module} Developer</h6>
                                    //                 <div className="content">
                                    //                     <img src={assets.langing_logo} alt="logo" />
                                    //                     <span className='traninng-tag'>Training</span>
                                    //                     <span className='traninng-tag'> . </span>
                                    //                     <span className='traninng-tag'>{formattedDate}</span>
                                    //                 </div>
                                    //             </div>
                                    //             <div className="bottom-content">
                                    //                 <Link to={'#'} onClick={(e) => handleSubmitNowClick(e, response?._id, true)}>
                                    //                     {"Preview Form"}
                                    //                 </Link>
                                    //             </div>
                                    //         </div>
                                    //     </>
                                    // }))
                                    shorlistedJob.map((item => {
                                        const matchModule = uniqueItems.find((uniqueitem) => uniqueitem.module === item.module);

                                        if ((!matchModule) || (responses.find(response => response.module === item.module)?.submitted_on)) return <></>
                                        console.log(item);
                                        return <div className="traning_section">
                                            <div className="left-content">
                                                <img src={assets.frontendimage} alt="frontend" />
                                            </div>
                                            <div className="right-content">
                                                <span className='traninning-program'>Training Program</span>
                                                <h6>Become a {item.module} Developer</h6>
                                                <div className="content">
                                                    <img src={assets.langing_logo} alt="logo" />
                                                    <span className='traninng-tag'>Training</span>
                                                    <span className='traninng-tag'> . </span>
                                                    <span className='traninng-tag'>{formattedDate}</span>
                                                </div>
                                            </div>
                                            {/* <div className="bottom-content">
                                                {
                                                    responses.find(response => response.module === item.module && response.username === currentUser.userinfo.username) ?
                                                        <Link to={'#'} onClick={(e) => handleSubmitNowClick(e, responses.find(response => response.module === item.module && response.username === currentUser.userinfo.username)?._id)}>
                                                            {"Submit Now"}
                                                        </Link>
                                                        :
                                                        <Link
                                                            to={'#'}
                                                            onClick={
                                                                (e) => createResp(e, item.module, matchModule?.question_link)
                                                            }
                                                        >
                                                            {
                                                                submitInitialResponseLoading ? <>Please wait...</> :
                                                                    responses.find(response => response.module === item.module && response.username === currentUser.userinfo.username) ?
                                                                        <>
                                                                            Submit Now
                                                                        </> :
                                                                        <>
                                                                            Start Now
                                                                        </>
                                                            }
                                                        </Link>
                                                }
                                            </div> */}
                                            <div className="view-question">
                                                <Link to={matchModule.question_link} target='_blank'>
                                                    {"View Question"}
                                                </Link>
                                            </div>
                                            <div className="bottom-content">
                                                <Link to={'#'}>
                                                    {"Preview Form"}
                                                </Link>
                                            </div>
                                        </div>
                                    }))
                                }
                            </>
                                :

                                shorlistedJob.map((item => {
                                    const matchModule = uniqueItems.find((uniqueitem) => uniqueitem.module === item.module);

                                    if ((!matchModule) || (responses.find(response => response.module === item.module)?.submitted_on)) return <></>
                                    return <div className="traning_section">
                                        <div className="left-content">
                                            <img src={assets.frontendimage} alt="frontend" />
                                        </div>
                                        <div className="right-content">
                                            <span className='traninning-program'>Training Program</span>
                                            <h6>Become a {item.module} Developer</h6>
                                            <div className="content">
                                                <img src={assets.langing_logo} alt="logo" />
                                                <span className='traninng-tag'>Training</span>
                                                <span className='traninng-tag'> . </span>
                                                <span className='traninng-tag'>{formattedDate}</span>
                                            </div>

                                            <div className="right-bottom-content">
                                                <Link to={matchModule.question_link} target='_blank'>
                                                    {"View Question"}
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="bottom-content">
                                            {
                                                responses.find(response => response.module === item.module && response.username === currentUser.userinfo.username) ?
                                                    <Link to={'#'} onClick={(e) => handleSubmitNowClick(e, responses.find(response => response.module === item.module && response.username === currentUser.userinfo.username)?._id)}>
                                                        {"Submit Now"}
                                                    </Link>
                                                    :
                                                    <Link
                                                        to={'#'}
                                                        onClick={
                                                            (e) => createResp(e, item.module, matchModule?.question_link)
                                                        }
                                                    >
                                                        {
                                                            submitInitialResponseLoading ? <>Please wait...</> :
                                                                responses.find(response => response.module === item.module && response.username === currentUser.userinfo.username) ?
                                                                    <>
                                                                        Submit Now
                                                                    </> :
                                                                    <>
                                                                        Start Now
                                                                    </>
                                                        }
                                                    </Link>
                                            }
                                        </div>
                                    </div>
                                }))
                    }
                </Section_3>
            </Wrapper >
            {
                showSubmitModal && <SubmitResponseModal
                    closeModal={handleCloseResponseModal}
                    submitBtnDisabled={submitBtnDisabled}
                    handleSubmitBtnClick={() => handleSubmitResponse()}
                    handleInputChange={(key, value) => setSubmitDataToSend((prevData) => { return { ...prevData, [key]: value } })}
                    inputValues={submitDataToSend}
                    inputValuesAreReadOnly={formIsReadOnly}
                />
            }

            {/* {questionsLink && <ViewQuestion questionsLink={questionsLink} showframe={showframe} />} */}
            <WrapperQna>
                {showIframe && (
                    <div className="iframe-container">
                        <iframe src={questionsLink} title="Questions"></iframe>
                        <button onClick={handleClose}>Close</button>
                    </div>
                )}
            </WrapperQna>

        </>

    )
}

export default TraningProgress;