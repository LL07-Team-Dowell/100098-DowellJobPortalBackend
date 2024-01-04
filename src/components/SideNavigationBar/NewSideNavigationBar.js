import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./style.css";
import { FiChevronRight, FiEdit } from "react-icons/fi";
import { FaUsersCog } from "react-icons/fa";
import SwitchViewsModal from "../SwitchViewsModal/SwitchViewsModal";
import { IoIosArrowDown } from "react-icons/io";
import { useCurrentUserContext } from "../../contexts/CurrentUserContext";
import { HiOutlineUserCircle } from "react-icons/hi";
import { useMediaQuery } from "@mui/material";
import { switchViewItem } from "./util";

const NewSideNavigationBar = ({ 
    className, 
    links, 
    runExtraFunctionOnNavItemClick, 
    superUser, 
    userHasOtherRoles, 
    otherPermittedRoles, 
    otherPermittedProjects, 
    assignedProject, 
    defaultRole,
    newSidebarDesign,
}) => {
    
    const navigate = useNavigate();
    const [ showViewsModal, setShowViewsModal ] = useState(false);
    const { pathname } = useLocation();
    const {
        currentUser,
        navLinksOpenForUser,
        setNavLinksOpenForUser,
        navLinksOpenForUserSet,
        setNavLinksOpenForUserSet,
    } = useCurrentUserContext();
    const isLargeScreen = useMediaQuery("(min-width: 992px)");

    useEffect(() => {
        if (!links || !Array.isArray(links) || navLinksOpenForUserSet) return

        const linksWithChildren = links?.filter(item => item.hasChildren && Array.isArray(item.children))?.map(item => item.id);
        
        setNavLinksOpenForUser(linksWithChildren);
        setNavLinksOpenForUserSet(true);

    }, [links, navLinksOpenForUserSet])

    useEffect(() => {
        if (navLinksOpenForUser?.includes(switchViewItem.id)) return setShowViewsModal(true)

        setShowViewsModal(false)
    }, [])

    const handleNavItemClick = (e, addressToNavigateTo) => {
        e.preventDefault();
        
        if (runExtraFunctionOnNavItemClick && typeof runExtraFunctionOnNavItemClick === "function") runExtraFunctionOnNavItemClick();

        navigate(addressToNavigateTo)
    }

    const handleSuperLinkItemClick = (e, id) => {
        e.preventDefault();
        setShowViewsModal(!showViewsModal);

        handleParentItemClick(id);
    }

    const handleParentItemClick = (id) => {
        if (!isLargeScreen) return
        
        const copyOfLinksWithChildItemsOpen = navLinksOpenForUser?.slice();
        const childItemsOfParentAreShowing = copyOfLinksWithChildItemsOpen.find(item => item === id);

        if (childItemsOfParentAreShowing) {
            setNavLinksOpenForUser(copyOfLinksWithChildItemsOpen.filter(item => item !== id))
            return
        }

        copyOfLinksWithChildItemsOpen.push(id);
        setNavLinksOpenForUser(copyOfLinksWithChildItemsOpen);
    }

    return <>
        <div className={`new__Side__Navigation__Bar ${className ? className : ''} ${newSidebarDesign ? 'new__Side__Design' : ''}`}>
            {
                !links || !Array.isArray(links) ? <></> :
            
                <ul className="new__Side__Navigation__Links">
                    <>
                        {
                            React.Children.toArray(links.map(link => {
                                if (!link.linkAddress) return <></>

                                if (link.hasChildren && Array.isArray(link.children)) return <li>
                                    <p className={link?.linkAddress?.includes(pathname) ? 'active' : ''} onClick={() => handleParentItemClick(link?.id)}>
                                        {link.icon ? link.icon : <></>}
                                        {link.text ? <span>{isLargeScreen ? link.text : link.textForSmallScreen ? link.textForSmallScreen : link.text}</span> : <></>}
                                        {
                                            !isLargeScreen ? <></> 
                                            : 
                                            <>
                                                {
                                                    navLinksOpenForUser?.includes(link.id) ? 
                                                        <IoIosArrowDown className="dropdown__ICon" /> 
                                                    : 
                                                    <FiChevronRight className="dropdown__ICon" />
                                                }
                                            </>
                                        }
                                    </p>
                                    {
                                        navLinksOpenForUser?.includes(link.id) && isLargeScreen &&
                                        <ul className="child__Nav__Links">
                                            {
                                                React.Children.toArray(link.children.map(child => {
                                                    return <Link to={child.linkAddress} onClick={(e) => handleNavItemClick(e, child.linkAddress)} className={child?.linkAddress?.includes(pathname) ? 'active' : ''}>
                                                        {child.icon ? child.icon : <></>}
                                                        {child.text ? <span>{child.text}</span> : <></>}
                                                    </Link>
                                                }))
                                            }
                                        </ul>
                                    }
                                </li>

                                return <li>
                                    <Link to={link.linkAddress} onClick={(e) => handleNavItemClick(e, link.linkAddress)} className={link?.linkAddress?.includes(pathname) ? 'active' : ''}>
                                        {link.icon ? link.icon : <></>}
                                        {link.text ? <span>{link.text}</span> : <></>}
                                    </Link>
                                </li>
                            }))
                        }
                        {
                            (superUser || userHasOtherRoles) && <li>
                                <Link to={'/'} onClick={(e) => handleSuperLinkItemClick(e, switchViewItem.id)}>
                                    {switchViewItem.icon}
                                    <span>{switchViewItem.text}</span>
                                    {
                                        newSidebarDesign && isLargeScreen && <>
                                            {
                                                showViewsModal ? 
                                                    <IoIosArrowDown className="dropdown__ICon" /> 
                                                : 
                                                <FiChevronRight className="dropdown__ICon" />
                                            }
                                        </>
                                    }
                                </Link>
                            </li>
                        }
                        {
                            showViewsModal && 
                            <SwitchViewsModal 
                                restrictedRoles={userHasOtherRoles ? true : false}
                                otherPermittedRoles={otherPermittedRoles} 
                                handleCloseModal={() => setShowViewsModal(false)} 
                                otherProjects={otherPermittedProjects}
                                assignedProject={assignedProject}
                                defaultRole={defaultRole}
                                newSidebarDesign={newSidebarDesign}
                            />
                        }
                    </>
                </ul>
            }
            {
                newSidebarDesign && isLargeScreen &&
                    <div className="new__Side__Nav__user__Wrap">
                        <Link to={"/user"}>
                            <>
                                {currentUser?.userinfo?.profile_img ? (
                                    <img
                                    src={currentUser?.userinfo?.profile_img}
                                    alt="#"
                                    style={{
                                        width: "30px",
                                        borderRadius: "50%",
                                        height: "30px",
                                        objectFit: "cover",
                                    }}
                                    />
                                ) : (
                                    <HiOutlineUserCircle className="icon" />
                                )}
                                <span>{currentUser?.userinfo?.first_name} {currentUser?.userinfo?.last_name}</span>
                            </>
                        </Link>
                    </div>
            }
        </div>
    </>
}

export default NewSideNavigationBar;