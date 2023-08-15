import { FiEdit, FiHome, FiUser } from "react-icons/fi";
import { ImStack } from "react-icons/im";
import {GiTeamIdea} from "react-icons/gi";
import { AiOutlinePlus } from "react-icons/ai";

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

export const groupLeadNavigationLinks = [
    {
        linkAddress: "/",
        icon: <AiOutlinePlus />,
        text: "Add",
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