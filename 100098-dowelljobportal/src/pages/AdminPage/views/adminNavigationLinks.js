import { AiOutlinePlus, AiOutlineSetting } from "react-icons/ai";
import { FiHome } from "react-icons/fi";
import { TbBrandGoogleAnalytics } from "react-icons/tb";

export const adminNavigationLinks = [
    {
        linkAddress: "/",
        icon: <FiHome />,
        text: "Home",
    },
    {
        linkAddress: "/add-job",
        icon: <AiOutlinePlus />,
        text: "Add job",
    },
    {
        linkAddress: "/report",
        icon: <TbBrandGoogleAnalytics />,
        text: "Report",
    },
    {
        linkAddress: "/settings",
        icon: <AiOutlineSetting />,
        text: "Settings",
    },
]