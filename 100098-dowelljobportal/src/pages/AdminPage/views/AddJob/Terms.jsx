import "./terms.styles.css";

import { MdOutlineAddCircle } from "react-icons/md";
import { MdCancel } from "react-icons/md";

const Terms = ({
  des,
  addDescription,
  deleteDescription,
  newDescription,
  setNewDescription,
}) => {
  return (
    <section className="general-terms">
      <h3>General Terms</h3>
      {des &&
        des.map((item, index) => {
          return (
            <div key={item.id} className="des">
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
          );
        })}
      <div className="input-des">
        <input
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          type="text"
        />
        <div className="add-des">
          <div>
            <MdOutlineAddCircle
              color="#005734"
              size="4em"
              onClick={addDescription}
            />
          </div>
          <span>Add General Terms</span>
        </div>
      </div>
    </section>
  );
};

export default Terms;
