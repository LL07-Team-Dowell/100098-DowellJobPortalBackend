import { AiOutlineTeam } from "react-icons/ai";
import { FiUser } from "react-icons/fi";
import { ImStack } from "react-icons/im";
import { AiOutlineHome } from "react-icons/ai";
import { FiSend } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";

export const afterSelectionLinks = [
    { 
        text: "Tasks", 
        icon: <ImStack />, 
        linkAddress: "/"
    },
    { 
        text: "Teams", 
        icon: <AiOutlineTeam />, 
        linkAddress: "/teams"
    },
    { 
        text: "User", 
        icon: <FiUser />, 
        linkAddress: "/user"
    },
]

export const loggedInCandidateNavLinks = [
    {
        icon: <AiOutlineHome />,
        text: "Home",
        linkAddress: "/",
    },
    {
        icon: <FiSend />,
        text: "Applied",
        linkAddress: "/applied"
    },
    {
        icon: <IoMdNotificationsOutline />,
        text: "Notifications",
        linkAddress: "/alerts"
    }
]