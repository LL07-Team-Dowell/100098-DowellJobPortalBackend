import { FiEdit, FiHome, FiUser } from "react-icons/fi";
import { ImStack } from "react-icons/im";
import { GiTeamIdea } from "react-icons/gi";
import { AiOutlinePlus } from "react-icons/ai";
import { RiFileList3Line } from "react-icons/ri";

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
  {
    linkAddress: "/request",
    icon: <RiFileList3Line />,
    text: "logs request",
  },
  {
    linkAddress: "/create-task",
    icon: <GiTeamIdea />,
    text: "Teams",
  },
  {
    linkAddress: "/user",
    icon: <FiUser />,
    text: "User",
  },
];

export const groupLeadNavigationLinks = [
  {
    linkAddress: "/",
    icon: <AiOutlinePlus />,
    text: "Add",
  },
  {
    linkAddress: "/grouplead-tasks",
    icon: <ImStack />,
    text: "Work logs",
  },
  {
    linkAddress: "/create-task",
    icon: <GiTeamIdea />,
    text: "Teams",
  },
  {
    linkAddress: "/user",
    icon: <FiUser />,
    text: "User",
  },
];
