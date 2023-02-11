import { useMediaQuery } from "@mui/material";
import { IoIosArrowBack } from "react-icons/io";
import SearchBar from "../SearchBar/SearchBar";
import "./style.css";

const TitleNavigationBar = ({ className, title, showSearchBar, handleBackBtnClick, hideBackBtn }) => {
    const isLargeScreen = useMediaQuery("(min-width: 992px)");

    return <>
        <div className={`title__Navigation__Bar__Container ${className ? className : ''}`}>
            <div className="title__Item">
                { 
                    !hideBackBtn &&
                    <div className="back__Icon__Container" onClick={handleBackBtnClick}>
                        <IoIosArrowBack className="back__Icon" />
                    </div>
                }
                { title && <h1>{title}</h1> }
            </div>
            { isLargeScreen && showSearchBar && <SearchBar />}
        </div>
    </>
}

export default TitleNavigationBar;