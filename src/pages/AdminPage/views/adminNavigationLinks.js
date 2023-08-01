import { AiOutlinePlus, AiOutlineSetting } from "react-icons/ai";
import { FiHome } from "react-icons/fi";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { GiTeamIdea } from "react-icons/gi";

export const adminNavigationLinks = [
  {
    linkAddress: "/",
    icon: <FiHome />,
    text: "Home",
  },
  {
    linkAddress: "/add",
    icon: <AiOutlinePlus />,
    text: "Add",
  },
  {
    linkAddress: "/report",
    icon: <TbBrandGoogleAnalytics />,
    text: "Report",
  },
  {
    linkAddress: "/create-task",
    icon: <GiTeamIdea />,
    text: "Teams",
  },
  {
    linkAddress: "/settings",
    icon: <AiOutlineSetting />,
    text: "Settings",
  },
];

export const subAdminNavigationLinks = [
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
]