import { AiOutlinePlus, AiOutlineSetting } from "react-icons/ai";
import { FiHome } from "react-icons/fi";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { GiTeamIdea } from "react-icons/gi";
import { ImStack } from "react-icons/im";
import { MdOutlineSpaceDashboard, MdOutlineWorkOutline } from "react-icons/md";
import { TfiAgenda } from "react-icons/tfi";

export const adminNavigationLinks = [
  {
    linkAddress: "/",
    icon: <MdOutlineSpaceDashboard />,
    text: "Dashboard",
  },
  {
    linkAddress: "/jobs",
    icon: <MdOutlineWorkOutline />,
    text: "Jobs",
  },
  {
    linkAddress: "/report",
    icon: <TbBrandGoogleAnalytics />,
    text: "Report",
  },
  {
    linkAddress: "/logs",
    icon: <ImStack />,
    text: "Work Logs",
  },
  {
    linkAddress: "/agenda",
    icon: <TfiAgenda />,
    text: "Agenda",
  },
  {
    linkAddress: "/teams",
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
    icon: <MdOutlineSpaceDashboard />,
    text: "Dashboard",
  },
  {
    linkAddress: "/jobs",
    icon: <MdOutlineWorkOutline />,
    text: "Jobs",
  },
  {
      linkAddress: "/report",
      icon: <TbBrandGoogleAnalytics />,
      text: "Report",
  },
]