import { HiOutlineUserCircle } from "react-icons/hi";
import logo from "../../assets/images/landing-logo.png";
import "./style.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import NewSideNavigationBar from "../../components/SideNavigationBar/NewSideNavigationBar";
import { Link } from "react-router-dom";
import { hrNavigationLinks } from "../../pages/HrPage/views/hrNavigationLinks";
import { accountNavigationLinks } from "../../pages/AccountPage/accountNavigationLinks";
import { teamleadNavigationLinks } from "../../pages/TeamleadPage/teamleadNavigationLinks";
import { AiOutlinePlus } from "react-icons/ai";
import { useMediaQuery } from "@mui/material";


const StaffJobLandingLayout = ({ children, hrView, accountView, teamleadView, runExtraFunctionOnNavItemClick, hideSideBar, adminView, searchValue, setSearchValue, handleNavIconClick }) => {
    const isLargeScreen = useMediaQuery("(min-width: 992px)");
    
    return <>
    <nav>
            <div className={`staff__Jobs__Layout__Navigation__Container ${adminView ? 'admin' : ''}`}>
                { 
                    !adminView && isLargeScreen && <Link to={"/"} className="jobs__Layout__Link__Item">
                        <img src={logo} alt={"dowell logo"} />
                    </Link>
                }
                {
                    adminView && <div className="admin__View__Title__Container" onClick={handleNavIconClick ? handleNavIconClick : () => {}}>
                        <div className="add__Icon__Container">
                            <AiOutlinePlus />
                        </div>
                        <h2>Add New Job</h2>
                    </div>
                }
                <SearchBar placeholder={adminView ? "Search by skill, job" : "Search for job/project"} searchValue={searchValue} handleSearchChange={setSearchValue} />
                
                <div className="jobs__Layout__Icons__Container">
                    <Link to={"/user"}>
                        <HiOutlineUserCircle className="icon" />
                    </Link>
                </div>
                <hr />
            </div>
        </nav>
        <main>
            <div className={`staff__Jobs__Layout__Content__Container ${accountView ? 'account' : ''}`}>
                { !hideSideBar && !adminView && <NewSideNavigationBar links={hrView ? hrNavigationLinks : accountView ? accountNavigationLinks : teamleadView ? teamleadNavigationLinks : []} runExtraFunctionOnNavItemClick={runExtraFunctionOnNavItemClick} /> }
                <div className={`jobs__Layout__Content ${adminView ? 'full__Width' : ''}`}>
                    { children }
                </div>
            </div>
        </main>
    </>
}

export default StaffJobLandingLayout;
