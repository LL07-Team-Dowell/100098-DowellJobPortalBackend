import React from 'react'
import styled from 'styled-components';
import * as assets from '../../../../assets/assetsIndex';
import { AiFillBook, AiFillHome, AiOutlineSearch } from 'react-icons/ai';
import { BiRightArrowAlt } from 'react-icons/bi';
import { Link } from 'react-router-dom';


const Wrapper = styled.div`
    font-family:'poppins';
    background-color:#F5F5F5;
`

const Section_1 = styled.div`
    height: 100vh;
    border-bottom: 1px solid gray;
`

const Section_2 = styled.div`
    height: 110vh;
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction: column;
    padding: 40px 0;


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

        .item-1{
            background-color: #FFFFFF;
            width: 300px;
            height: 300px;
            padding: 20px 30px;
            border-radius: 10px;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin: 10px 0;

            img{
                width:60px;
                height:60px;
            }
            h2{
                font-weight:500;
            }
            p{
                font-size:12px;
                font-weight:300;
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
                    width:70px
                }
            }
        }
        .item-2{
            img{
                width:300px;
                height: 300px;
                margin: 10px 0;
            }
        }
    }
`

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 0.1px solid #dfdddd;
  padding: 0 16px;
  height: 10vh;
  background-color: white;
`;

const NavbarItem = styled.div`
    .item {
        display: flex;
        justify-content: space-around;
        align-items: center;
        position: relative;
        img{
            width: 100px;
            height: 100px;
            padding: 10px;
        }
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
            font-size: 25px;
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

const Hero = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;

    .left-content{
        p{
            font-size: 15px;
            font-weight: 300;
        }
        button{
            border: none;
            background-color: #005734;
            color: white;
            padding: 15px 40px;
            border-radius: 10px;
            font-weight:500;
            font-size: 15px;
            cursor: pointer;
        }
    }

    .right-content{
        img {
            display: block;
            width: 600px;
        }
    }
`

function CandidateTranningScreen() {

    return (
        <Wrapper>
            <Section_1>
                <Navbar>
                    <NavbarItem>
                        <div className="item">
                            <img src={assets.langing_logo} alt="logo" />
                            <h1>Training</h1>
                        </div>
                    </NavbarItem>
                    <NavbarItem>
                        <div className="item">
                            <AiOutlineSearch className='svg' />
                            <input type="text" placeholder='Search for training program' />
                        </div>
                    </NavbarItem>
                    <NavbarItem>
                        <div className="item">
                            <div className="home">
                                <AiFillHome />
                                <p>Home</p>
                            </div>
                            <div className="tranning">
                                <AiFillBook />
                                <p>Tranning</p>
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
                        <button>Start Now</button>
                    </div>
                    <div className="right-content">
                        <img src={assets.hero_image} alt="hero" />
                    </div>
                </Hero>
            </Section_1>

            <Section_2>
                <h1>Our Training Programs</h1>
                <div className="traning-items">
                    <div className="item-1">
                        <img src={assets.frontend_icon} alt="frontend" />
                        <br />
                        <h2>Front-end</h2>
                        <br />
                        <p>Prepare for a career in Front-end Development. Receive professional-level training from uxliving lab</p>
                        <br />
                        <button>
                            <Link to="/traning">
                                Start Now <BiRightArrowAlt />
                            </Link>
                        </button>

                        <div className="bottom-img">
                            <img src={assets.bg_rectang} alt="rectbg" />
                        </div>
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
                    </div>
                    <div className="item-2">
                        <img src={assets.lock_screen} alt="" />
                    </div>
                </div>
            </Section_2>
        </Wrapper>
    )
}

export default CandidateTranningScreen;
