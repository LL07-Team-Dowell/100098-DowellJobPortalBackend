import { FiHome } from "react-icons/fi";
import { GiTeamIdea } from "react-icons/gi";
import { TbBrandGoogleAnalytics } from "react-icons/tb";

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
        linkAddress: "/teams",
        icon: <GiTeamIdea />,
        text: "Teams",
    },
]