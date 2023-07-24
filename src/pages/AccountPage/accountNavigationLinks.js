import { BsCashCoin } from "react-icons/bs";
import { FiHome, FiUser } from "react-icons/fi";
import { MdCancelPresentation } from "react-icons/md";

export const accountNavigationLinks = [
    {
        linkAddress: "/",
        icon: <FiHome />,
        text: "Home",
    },
    {
        linkAddress: "/payments",
        icon: <BsCashCoin />,
        text: "Payments",
    },
    {
        linkAddress: "/rejected",
        icon: <MdCancelPresentation />,
        text: "Rejected"
    },
    {
        linkAddress: "/user",
        icon: <FiUser />, 
        text: "User",
    }
]