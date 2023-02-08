import { FiHome } from "react-icons/fi";
import { ImStack } from "react-icons/im";
import { IoCalendarOutline } from "react-icons/io5";

export const hrNavigationLinks = [
    {
        linkAddress: "/",
        icon: <FiHome />,
        text: "Home",
    },
    {
        linkAddress: "/tasks",
        icon: <ImStack />,
        text: "Tasks"
    },
    {
        linkAddress: "/attendance",
        icon: <IoCalendarOutline />,
        text: "Attendance",
    }
]