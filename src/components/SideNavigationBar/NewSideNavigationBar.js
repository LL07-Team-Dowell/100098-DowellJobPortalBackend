import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import { FiEdit } from "react-icons/fi";
import { FaUsersCog } from "react-icons/fa";
import SwitchViewsModal from "../SwitchViewsModal/SwitchViewsModal";

const NewSideNavigationBar = ({ className, links, runExtraFunctionOnNavItemClick, superUser }) => {
    
    const navigate = useNavigate();
    const [ showViewsModal, setShowViewsModal ] = useState(false);

    const handleNavItemClick = (e, addressToNavigateTo) => {
        e.preventDefault();
        
        if (runExtraFunctionOnNavItemClick && typeof runExtraFunctionOnNavItemClick === "function") runExtraFunctionOnNavItemClick();

        navigate(addressToNavigateTo)
    }

    const handleSuperLinkItemClick = (e) => {
        e.preventDefault();
        setShowViewsModal(!showViewsModal);
    }

    return <>
        <div className={`new__Side__Navigation__Bar ${className ? className : ''}`}>
            {
                !links || !Array.isArray(links) ? <></> :
            
                <ul className="new__Side__Navigation__Links">
                    <>
                        {
                            React.Children.toArray(links.map(link => {
                                if (!link.linkAddress) return <></>

                                return <li>
                                    <Link to={link.linkAddress} onClick={(e) => handleNavItemClick(e, link.linkAddress)}>
                                        {link.icon ? link.icon : <></>}
                                        {link.text ? <span>{link.text}</span> : <></>}
                                    </Link>
                                </li>
                            }))
                        }
                        {
                            superUser && <li>
                                <Link to={'/'} onClick={handleSuperLinkItemClick}>
                                    <FaUsersCog />
                                    <span>Switch Views</span>
                                </Link>
                            </li>
                        }
                        {
                            showViewsModal && <SwitchViewsModal handleCloseModal={() => setShowViewsModal(false)} />
                        }
                    </>
                </ul>
            }
        </div>
    </>
}

export default NewSideNavigationBar;