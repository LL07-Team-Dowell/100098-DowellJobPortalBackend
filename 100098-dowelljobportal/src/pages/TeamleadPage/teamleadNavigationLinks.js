import { FiHome, FiUser } from "react-icons/fi";
import { ImStack } from "react-icons/im";

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
        linkAddress: "/user",
        icon: <FiUser />, 
        text: "User",
    }
]