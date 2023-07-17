import { FiEdit, FiHome, FiUser } from "react-icons/fi";
import { ImStack } from "react-icons/im";
import {GiTeamIdea} from "react-icons/gi";

export const teamleadNavigationLinks = [
    {
        linkAddress: "/",
        icon: <FiHome />,
        text: "Home",
    },
    {
        linkAddress: "/task",
        icon: <ImStack />,
        text: "Tasks"
    },
    {
        linkAddress: "/create-task",
        icon: <GiTeamIdea />, 
        text: "Teams"
    },
    {
        linkAddress: "/user",
        icon: <FiUser />, 
        text: "User",
    },
 
]