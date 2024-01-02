import { AiOutlinePlus, AiOutlineSetting } from "react-icons/ai";
import { FiHome } from "react-icons/fi";
import { TbBrandGoogleAnalytics, TbDeviceAnalytics } from "react-icons/tb";
import { GiTeamIdea } from "react-icons/gi";
import { ImStack } from "react-icons/im";
import { MdOutlineSpaceDashboard, MdOutlineWorkOutline } from "react-icons/md";
import { TfiAgenda } from "react-icons/tfi";
import { GoOrganization, GoTasklist } from "react-icons/go";
import { FaUsers } from "react-icons/fa";
import { PiTreeStructure } from "react-icons/pi";

export const adminNavigationLinks = [

  {
    id: '1',
    linkAddress: "/",
    icon: <MdOutlineSpaceDashboard />,
    text: "Dashboard",
  },
  {
    id: '2',
    linkAddress: "/",
    icon: <TbDeviceAnalytics />,
    text: "Reporting",
    hasChildren: true,
    children: [
      {
        linkAddress: "/agenda",
        icon: <TfiAgenda />,
        text: "Agenda",
      },
      {
        linkAddress: "/report",
        icon: <TbBrandGoogleAnalytics />,
        text: "Report",
      },
    ]
  },
  {
    id: '3',
    linkAddress: "/",
    icon: <GoOrganization />,
    text: "My Organization",
    textForSmallScreen: "Organization",
    hasChildren: true,
    children: [
      {
        linkAddress: "/all-applications",
        icon: <FaUsers />,
        text: "Applications",
      },
      {
        linkAddress: "/",
        icon: <PiTreeStructure />,
        text: "Company Structure",
      },
      {
        linkAddress: "/jobs",
        icon: <MdOutlineWorkOutline />,
        text: "Jobs",
      },
      {
        linkAddress: "/add",
        icon: <GoTasklist />,
        text: "Projects",
      },

      {
        linkAddress: "/logs",
        icon: <ImStack />,
        text: "Work Logs",
      },
      {
        linkAddress: "/teams",
        icon: <GiTeamIdea />,
        text: "Teams",
      },
    ]
  },
  {
    id: '4',
    linkAddress: "/settings",
    icon: <AiOutlineSetting />,
    text: "Settings",
  },
];

export const subAdminNavigationLinks = [
  {
    id: '1',
    linkAddress: "/",
    icon: <MdOutlineSpaceDashboard />,
    text: "Dashboard",
  },
  {
    id: '2',
    linkAddress: "/jobs",
    icon: <MdOutlineWorkOutline />,
    text: "Jobs",
  },
  {
    id: '3',
    linkAddress: "/report",
    icon: <TbBrandGoogleAnalytics />,
    text: "Report",
  },
]