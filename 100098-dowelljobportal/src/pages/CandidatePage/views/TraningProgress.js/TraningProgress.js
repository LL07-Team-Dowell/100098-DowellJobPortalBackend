import React, { useEffect, useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io';
import styled from 'styled-components';
import * as assets from '../../../../assets/assetsIndex';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrentUserContext } from '../../../../contexts/CurrentUserContext';
import { FaRegUserCircle } from 'react-icons/fa';
import { getAllQuestions } from '../../../../services/commonServices';

function TraningProgress({ shorlistedJob }) {
    // console.log(shorlistedJob[0].shortlisted_on);
    // const { currentUser } = useCurrentUserContext();
    const [complete, setComplete] = useState(false);
    const username = shorlistedJob[0]?.applicant;
    const shortlistedate = shorlistedJob[0].shortlisted_on;
    const date = new Date(shortlistedate);
    const formattedDate = date.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

    //Get All Questions
    const [allquestions, setAllQuestions] = useState([]);
    const [uniqueItems, setUniqueItems] = useState([]);
    const uniqueTags = new Set();

    useEffect(() => {
        const fetchQuestions = async () => {
            if (shorlistedJob.length > 0) {
                const companyId = shorlistedJob[0].company_id;
                const response = await getAllQuestions(companyId);
                const allquestions = response.data.response.data;
                setAllQuestions(allquestions);
            }
        };

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


    const Wrapper = styled.div`
        font-family:'poppins';
        background-color:#ffffff;
        height: 30rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: reletive;
    `

    const Section_1 = styled.div`
        font-family:'poppins';
        border-bottom: 1px solid #dfdddd;
        font-family:'poppins';
        height: 14rem;
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
                        shorlistedJob.map((item => {
                            const matchModule = uniqueItems.find((uniqueitem) => uniqueitem.module === item.module);

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
                                <div className="bottom-content">
                                    {matchModule && (
                                        <Link to={matchModule.question_link} target='_blank'>
                                            {complete ? "Preview Form" : "Start Now"}
                                        </Link>
                                    ) || <Link to="#">
                                            {complete ? "Preview Form" : "Start Now"}
                                        </Link>}
                                </div>

                            </div>
                        }))
                    }
                </Section_3>
            </Wrapper >
        </>

    )
}

export default TraningProgress;
