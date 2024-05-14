import { useMediaQuery } from "@mui/material";
import { IoIosArrowBack, IoMdRefresh } from "react-icons/io";
import SearchBar from "../SearchBar/SearchBar";
import "./style.css";
import { useNavigate } from "react-router-dom";

const TitleNavigationBar = ({ className, title, showSearchBar, handleBackBtnClick, hideBackBtn, buttonWrapClassName, useDefaultBehavior=false }) => {
    const isLargeScreen = useMediaQuery("(min-width: 992px)");
    const navigate = useNavigate();

    return <>
        <div className={`title__Navigation__Bar__Container ${className ? className : ''}`}>

            <div className="title__Item">
                {
                    !hideBackBtn &&
                    <div 
                        className={`back__Icon__Container ${buttonWrapClassName ? buttonWrapClassName : ''}`} 
                        onClick={
                            useDefaultBehavior ? 
                                () => navigate(-1)
                            :
                            !handleBackBtnClick ? () => {}
                            :
                            () => handleBackBtnClick()
                        }>
                        <IoIosArrowBack className="back__Icon" />
                    </div>
                }
                {title && <h1>{title}</h1>}
            </div>
            
            {isLargeScreen && showSearchBar && <SearchBar />}
        </div>
    </>
}

export default TitleNavigationBar;