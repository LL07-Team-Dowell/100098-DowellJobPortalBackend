import { useMediaQuery } from "@mui/material";
import TitleNavigationBar from "../../../components/TitleNavigationBar/TitleNavigationBar";
import TogglerNavMenuBar from "../../../components/TogglerNavMenuBar/TogglerNavMenuBar";
import StaffJobLandingLayout from "../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout"
import { BsPersonCheck, BsPersonPlus, BsPersonX } from "react-icons/bs";
import { AiOutlineRedo } from "react-icons/ai";

const AccountPageLayout = ({ 
    children,
    searchValue,
    handleSearch,
    searchPlaceHolder,
    hideSearchBar,
    titleNavBarText,
    hideTitleNavBackBtn,
    handleTitleNavBackBtnClick,
    hideTopTogglerMenu,
    currentActiveMenuItem,
    handleMenuItemClick,
}) => {
    const isLargeScreen = useMediaQuery("(min-width: 992px)");

    return <>
        <StaffJobLandingLayout
            accountView={true}
            searchValue={searchValue}
            setSearchValue={handleSearch}
            searchPlaceHolder={searchPlaceHolder}
            hideSearchBar={hideSearchBar}
        >
            <TitleNavigationBar
                title={titleNavBarText}
                hideBackBtn={hideTitleNavBackBtn}
                handleBackBtnClick={handleTitleNavBackBtnClick}
            />

            {
                !hideTopTogglerMenu && <TogglerNavMenuBar
                    menuItems={
                        isLargeScreen
                        ? ["Hire", "Onboarding", "Rehire", "Reject"]
                        : [
                            { icon: <BsPersonPlus />, text: "Hire" },
                            { icon: <BsPersonCheck />, text: "Onboarding" },
                            { icon: <AiOutlineRedo />, text: "Rehire" },
                            { icon: <BsPersonX />, text: "Reject" },
                            ]
                    }
                    currentActiveItem={currentActiveMenuItem}
                    handleMenuItemClick={handleMenuItemClick}
                />
            }

            { children }
        </StaffJobLandingLayout>
    </>
}

export default AccountPageLayout;