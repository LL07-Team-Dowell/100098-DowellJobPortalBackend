import { FiHome } from "react-icons/fi";
import { GiTeamIdea } from "react-icons/gi";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { RiFileList3Line } from "react-icons/ri";

export const projectLeadNavLinks = [
    {
        linkAddress: "/",
        icon: <FiHome />,
        text: "Home",
    },
    {
        linkAddress: "/report",
        icon: <TbBrandGoogleAnalytics />,
        text: "Report",
    },
    {
        linkAddress: "/log-requests",
        icon: <RiFileList3Line />,
        text: "Log requests",
    },
    {
        linkAddress: "/teams",
        icon: <GiTeamIdea />,
        text: "Teams",
    },
]