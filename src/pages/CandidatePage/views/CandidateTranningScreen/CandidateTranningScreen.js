import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import * as assets from '../../../../assets/assetsIndex';
import { AiFillBook, AiFillHome, AiOutlineSearch } from 'react-icons/ai';
import { BiRightArrowAlt } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import { getAllQuestions, getAllTrainingResponses } from '../../../../services/commonServices';
import { useCurrentUserContext } from '../../../../contexts/CurrentUserContext';
import { useResponsesContext } from '../../../../contexts/Responses';
import { createTrainingManagementResponse } from '../../../../services/hrTrainingServices';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';


const Wrapper = styled.div`
    font-family:'poppins';
    background-color:#ffffff;

    .container-training{
        width: 1400px;
        margin: auto;
    }

    @media screen and (max-width: 1400px) {
    .container-training{
         width: 95%;
       }
    }
`

const Section_1 = styled.div`
    border-bottom: 1px solid #dfdddd;
    position: relative; 

    a{
        color: #FFFFFF;
        font-family:'poppins';
    }
`

const Section_2 = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction: column;
    padding: 40px 0;
    position: relative; 

    h1{
        text-align:center;
        padding:40px 0;
    }

    .traning-items{
        display:flex;
        width: 80%;
        flex-wrap:wrap;
        margin:auto;
        justify-content: space-around;
        position: relative; 

        .item-1{
            background-color: #FFFFFF;
            width: 300px;
            height: 320px;
            padding: 15px 25px;
            border-radius: 10px;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin: 10px 0;
            box-shadow: 0px 3.34202px 33.4202px 5.01302px rgba(0, 0, 0, 0.06);

            img{
                width:60px;
                height:60px;
                margin-bottom: 1rem;
            }
            h2{
                font-weight:500;
                margin-bottom: 1rem;
            }
            p{
                font-size:12px;
                font-weight:300;
                color: #7E7E7E;
                margin-bottom: 1rem;
            }
            button {
                border: none;
                a{
                    display:flex;
                    align-items:center;
                    font-size: 16px;
                    background-color: #FFFFFF;
                    border:none;
                    cursor:pointer;
                    color: black;
                    font-weight: 600;
                    font-family: 'poppins';
                    
                    svg{
                        font-size: 25px;
                        margin-left: 10px;
                    }
                } 
                
            }
            .bottom-img{
                position: absolute;
                right: 0px;
                bottom: -6px;
                img{
                    width:70px;
                    height: 50px;
                }
            }
        }
        .item-2{
            img{
                width:300px;
                height: 320px;
                margin: 10px 0;
            }
        }
    }
`


const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dfdddd;
  padding: 0 16px;
  height: 5rem;
  background-color: white;
  position: relative;
  overflow: hidden;

  /* Responsive Styles */
  @media (max-width: 840px) {
    flex-direction: column;
    height: auto;

    div.item {
      width: 100%;
      padding: 0.3rem;
      text-align: center;
    }
  }
`;

const NavbarItem = styled.div`
  .item {
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: relative;
    padding: 0 1rem;
    img {
      width: 60px;
      height: 60px;
    }
    a {
      color: #7e7e7e;
    }

    h1 {
      color: #005734;
      font-size: 33px;
      margin-left: 0.5rem;
    }

    input {
      padding: 15px 40px;
      width: 30rem;
      background-color: #f5f5f5;
      border: none;
    }
    svg.svg {
      max-width: 100%;
      font-size: 22px;
      position: absolute;
      left: 30px;
      color: #005734;
    }
    svg {
      font-size: 25px;
      cursor: pointer;
    }
    .home {
      width: 100px;
      text-align: center;
      color: #7e7e7e;
      p {
        font-size: 15px;
      }
    }
    .tranning {
      width: 100px;
      text-align: center;
      color: #7e7e7e;
      p {
        font-size: 15px;
      }
    }
  }

  /* Responsive Styles */
  @media (max-width: 1000px) {
   .item {
      input{
        width: 22rem;
      }
      .home{
        width: auto;
      }
      svg.svg{
        left: 20px;
      }
  }
  }
`;




const Hero = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 38rem;
  position: relative;

  .left-content {
    p {
      font-size: 16px;
      font-weight: 300;
    }

    a{
      text-align: left;
    }

    h1 {
      font-size: 41px;
    }

    button {
      border: none;
      background-color: #005734;
      color: white;
      padding: 15px 40px;
      border-radius: 10px;
      font-weight: 500;
      font-size: 15px;
      cursor: pointer;
    }
  }

  .right-content {
    img {
      display: block;
      width: 100%;
      max-width: 600px; /* Limit the maximum width of the image */
      height: auto; /* Maintain aspect ratio */
      margin: auto;
    }
  }

  /* Responsive Styles */
  @media (max-width: 840px) {
    flex-direction: column-reverse;
    height: auto;

    .left-content,
    .right-content {
      width: 100%;
      text-align: center;
    }

    .left-content {
      padding: 1rem;
    }
  }
`

function CandidateTranningScreen({ shorlistedJob }) {
  const { currentUser } = useCurrentUserContext();
  const { responses, setresponses, allquestions, setAllQuestions } = useResponsesContext();

  let navigate = useNavigate()
  const [uniqueItems, setUniqueItems] = useState([]);
  const uniqueTags = new Set();
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [submitInitialResponseLoading, setSubmitInitialResponseLoading] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (shorlistedJob.length > 0) {
        const companyId = shorlistedJob[0].company_id;
        const response = await getAllQuestions(companyId);
        const allquestions = response.data.response.data;
        setAllQuestions(allquestions);
        setQuestionsLoading(false);
      }
    };

    fetchQuestions();

    // if (allquestions.length > 0) return setQuestionsLoading(false);
    console.log(allquestions.length);

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

  useEffect(() => {

    if (responses.length > 0) return

    getAllTrainingResponses(currentUser?.portfolio_info[0]?.org_id).then(res => {
      setresponses(res.data.response.data ? res.data.response.data : []);
    }).catch(err => {
      console.log(err)
    })

  }, [])

  const createResp = (itemModule, itemQuestionLink) => {
    console.log(itemModule);
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

  return (
    <Wrapper>
      <div className="container-training">
        <Section_1>
          <Navbar>
            <NavbarItem>
              <div className="item right-item">
                <img src={assets.langing_logo} alt="logo" />
                <h1>Training</h1>
              </div>
            </NavbarItem>
            <NavbarItem>
              <div className="item middle-item" id='item'>
                <AiOutlineSearch className='svg' />
                <input type="text" placeholder='Search for training program' />
              </div>
            </NavbarItem>
            <NavbarItem>
              <div className="item left-item">
                <div className="home">
                  <AiFillHome />
                  <p>Home</p>
                </div>
                <div className="tranning">
                  <Link to="/traning">
                    <AiFillBook />
                  </Link>
                  <p>Training</p>
                </div>
              </div>
            </NavbarItem>
          </Navbar>

          <Hero>
            <div className="left-content">
              <h1>Get Training from <br /> Experts</h1>
              <br />
              <p>a solution for easy and flexible learning, you <br /> can study anywhere through this platform</p>
              <br />
              <Link to="/traning">
                <button>
                  Get started
                </button>
              </Link>

            </div>
            <div className="right-content">
              <img src={assets.hero_image} alt="hero" />
            </div>
          </Hero>
        </Section_1>

        <Section_2>
          <h1>Your Training Programs</h1>
          <br />
          {
            questionsLoading ? <LoadingSpinner /> :
              <div className="traning-items">
                {
                  shorlistedJob.map((item => {
                    const matchModule = uniqueItems.find((uniqueitem) => uniqueitem.module === item.module);
                    console.log(item);
                    if (!matchModule) return <></>

                    return < div className="item-1" >
                      <img src={assets.frontend_icon} alt="frontend" />
                      <h2>{item?.module}</h2>
                      <p>Prepare for a career in {item.module} Development. Receive professional-level training from uxliving lab</p>
                      <button
                        onClick={
                          responses.find(response => response.module === item.module && response.username === currentUser.userinfo.username) ?
                            () => navigate('/traning')
                            :
                            () => createResp(item.module, matchModule?.question_link)
                        }
                        style={{
                          alignItems: 'center',
                          fontSize: '16px',
                          backgroundColor: '#FFFFFF',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'black',
                          fontWeight: '600',
                          fontFamily: 'poppins',
                          display: 'flex',
                        }}
                      >
                        {
                          submitInitialResponseLoading ? <>Please wait...</> :
                            responses.find(response => response.module === item.module && response.username === currentUser.userinfo.username) ?
                              <>
                                View Now <BiRightArrowAlt />
                              </> :
                              <>
                                Start Now <BiRightArrowAlt />
                              </>
                        }
                      </button>

                      <div className="bottom-img">
                        <img src={assets.bg_rectang} alt="rectbg" />
                      </div>
                    </div>
                  }), [])
                }

                {/* {
                shorlistedJob.length % 3 === 1 ? <>
                  <div className="item-2">
                    <img src={assets.lock_screen} alt="" />
                  </div>
                </> : <></>
              }
              {
                shorlistedJob.length % 3 === 2 ? <>
                  <div className="item-2">
                    <img src={assets.lock_screen} alt="" />
                  </div>
                </> : <></>
              } */}

                {/* <div className="item-1">
                <img src={assets.frontend_icon} alt="frontend" />
                <h2>Front-end</h2>
                <p>Prepare for a career in Front-end Development. Receive professional-level training from uxliving lab</p>
                <button>
                  <Link to="#">
                    Start Now <BiRightArrowAlt />
                  </Link>
                </button>

                <div className="bottom-img">
                  <img src={assets.bg_rectang} alt="rectbg" />
                </div>
              </div> */}
                {/* <div className="item-2">
                <img src={assets.lock_screen} alt="" />
              </div>
              <div className="item-2">
                <img src={assets.lock_screen} alt="" />
              </div>
              <div className="item-2">
                <img src={assets.lock_screen} alt="" />
              </div>
              <div className="item-2">
                <img src={assets.lock_screen} alt="" />
              </div>
              <div className="item-2">
                <img src={assets.lock_screen} alt="" />
              </div> */}
              </div>
          }
        </Section_2>
      </div >
    </Wrapper >
  )
}

export default CandidateTranningScreen;
