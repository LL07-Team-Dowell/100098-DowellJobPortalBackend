import { AiOutlineTeam } from "react-icons/ai";
import { FiUser } from "react-icons/fi";
import { ImStack } from "react-icons/im";
import { AiOutlineHome } from "react-icons/ai";
import { FiSend } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlinePlus } from "react-icons/ai";
import { RiFileList3Line } from "react-icons/ri";
import { LiaFileInvoiceSolid } from "react-icons/lia";

export const afterSelectionLinks = [
  {
    text: "Add",
    icon: <AiOutlinePlus />,
    linkAddress: "/",
  },
  {
    text: "Work logs",
    icon: <ImStack />,
    linkAddress: "/task",
  },
  {
    text: "Log Requests",
    icon: <RiFileList3Line />,
    linkAddress: "/work-log-request",
  },
  {
    text: "Teams",
    icon: <AiOutlineTeam />,
    linkAddress: "/teams",
  },
  {
    text: "Invoice",
    icon: <LiaFileInvoiceSolid />,
    linkAddress: "/invoice",
  },
  // {
  //   text: "User",
  //   icon: <FiUser />,
  //   linkAddress: "/user",
  // },
];

export const loggedInCandidateNavLinks = [
  {
    icon: <AiOutlineHome />,
    text: "Home",
    linkAddress: "/",
  },
  {
    icon: <FiSend />,
    text: "Applied",
    linkAddress: "/applied",
  },
  {
    icon: <IoMdNotificationsOutline />,
    text: "Notifications",
    linkAddress: "/alerts",
  },
];
