import { ReactComponent as Frontend } from "../HrTrainingScreen/assets/system3.svg";
import { ReactComponent as Ux } from "../HrTrainingScreen/assets/ux-design-1.svg";
import { ReactComponent as Backend } from "../HrTrainingScreen/assets/database-1.svg";
import { RiEdit2Fill } from "react-icons/ri";

export const trainingCards = [
  {
    id: 1,
    module: "Frontend",
    description:
      "Prepare for a career in front-end Development. Receive professional-level training from uxliving lab",
    svg: <Frontend />,
    action: <RiEdit2Fill style={{ fontSize: "1.4rem", color: "#000" }} />,
  },
  {
    id: 2,
    module: "Backend",
    description:
      "Prepare for a career in Back-end Development. Receive professional-level training from uxliving lab",
    svg: <Backend />,
    action: <RiEdit2Fill style={{ fontSize: "1.4rem", color: "#000" }} />,
  },
  {
    id: 3,
    module: "UI/UX",
    description:
      "Prepare for a career in UI/UX. Receive professional-level training from uxliving lab",
    svg: <Ux />,
    action: <RiEdit2Fill style={{ fontSize: "1.4rem", color: "#000" }} />,
    // escapeSlash: true,
  },
  {
    id: 4,
    module: "Virtual_Assistant",
    description:
      "Prepare for a career as a Virtual Assistant . Receive professional-level training from uxliving lab",
    svg: <Frontend />,
    action: <RiEdit2Fill style={{ fontSize: "1.4rem", color: "#000" }} />,
  },
  {
    id: 5,
    module: "Web",
    description:
      "Prepare for a career in Web Development. Receive professional-level training from uxliving lab",
    svg: <Backend />,
    action: <RiEdit2Fill style={{ fontSize: "1.4rem", color: "#000" }} />,
  },
  {
    id: 6,
    module: "Mobile",
    description:
      "Prepare for a career in Mobile Development. Receive professional-level training from uxliving lab",
    svg: <Ux />,
    action: <RiEdit2Fill style={{ fontSize: "1.4rem", color: "#000" }} />,
  },
];
