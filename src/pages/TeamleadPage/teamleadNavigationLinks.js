import { FiEdit, FiHome, FiUser } from "react-icons/fi";
import { ImStack } from "react-icons/im";
import { GiTeamIdea } from "react-icons/gi";
import { AiOutlinePlus } from "react-icons/ai";
import { RiFileList3Line } from "react-icons/ri";
import { TfiAgenda } from "react-icons/tfi";
import { LiaFileInvoiceSolid } from "react-icons/lia";

export const teamleadNavigationLinks = [
  {
    linkAddress: "/",
    icon: <FiHome />,
    text: "Home",
  },
  {
    linkAddress: "/task",
    icon: <ImStack />,
    text: "Work logs",
  },
  // {
  //   linkAddress: "/request",
  //   icon: <RiFileList3Line />,
  //   text: "Log requests",
  // },
  {
    linkAddress: "/agenda",
    icon: <TfiAgenda />,
    text: "Agenda",
  },
  {
    linkAddress: "/create-task",
    icon: <GiTeamIdea />,
    text: "Teams",
  },
  {
    icon: <LiaFileInvoiceSolid />,
    linkAddress: "/invoice",
    text: "Invoice",
  },
  // {
  //   linkAddress: "/user",
  //   icon: <FiUser />,
  //   text: "User",
  // },
];

export const groupLeadNavigationLinks = [
  {
    linkAddress: "/",
    icon: <AiOutlinePlus />,
    text: "Add",
  },
  {
    linkAddress: "/logs-landing",
    icon: <ImStack />,
    text: "Work logs",
  },
  // {
  //   linkAddress: "/log-requests",
  //   icon: <RiFileList3Line />,
  //   text: "Log requests",
  // },
  {
    linkAddress: "/create-task",
    icon: <GiTeamIdea />,
    text: "Teams",
  },
  {
    linkAddress: "/agenda",
    icon: <TfiAgenda />,
    text: "Agenda",
  },
  {
    icon: <LiaFileInvoiceSolid />,
    linkAddress: "/invoice",
    text: "Invoice",
  },
  // {
  //   linkAddress: "/user",
  //   icon: <FiUser />,
  //   text: "User",
  // },
];
