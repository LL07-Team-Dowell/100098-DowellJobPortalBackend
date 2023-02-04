import "./terms.styles.css";

import { useState } from "react";

import { MdOutlineAddCircle } from "react-icons/md";
import { MdCancel } from "react-icons/md";

const terms = [
  {
    id: 1,
    name: "General Terms",
    add: "Add General Terms",
  },
  {
    id: 2,
    name: "Technical specifications",
    add: "Add Specifications",
  },
  {
    id: 3,
    name: "Payment Terms",
    add: "Add Payment Terms",
  },
  {
    id: 4,
    name: "Workflow",
    add: "Add Workflow",
  },
  {
    id: 5,
    name: "Others",
    add: "Add Others",
  },
];

const Terms = () => {
  const [des, setDes] = useState([]);
  const [newDescription, setNewDescription] = useState("");

  //add description
  const addDescription = () => {
    if (newDescription) {
      let num = des.length + 1;
      let newTerm = { id: num, title: newDescription, status: false };
      setDes([...des, newTerm]);
      setNewDescription(" ");
    }
  };

  //delete description
  const deleteDescription = (id) => {
    let newDescription = des.filter((item) => item.id !== id);
    setDes(newDescription);
  };

  return (
    <div className="general-terms">
      {terms.map((term) => (
        <div className="terms" key={term.id}>
          <div className="terms-title">
            <h3>{term.name}</h3>
          </div>
          {des.map((item, index) => (
            <div className="des" key={item.id}>
              <div>
                <span>{index + 1}. </span>
                <span>{item.title}</span>
              </div>
              <MdCancel
                color="#7e7e7e"
                size="22px"
                onClick={() => deleteDescription(item.id)}
              />
            </div>
          ))}
          <div className="terms-add">
            <div className="input-des">
              <input
                className="description"
                id={term.id}
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
            <div className="add-des">
              <MdOutlineAddCircle
                color="#005734"
                size="4em"
                onClick={addDescription}
              />
              <span>{term.add}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Terms;
