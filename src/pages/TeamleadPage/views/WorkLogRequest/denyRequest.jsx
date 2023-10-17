import React, { useState } from "react";
import "../../../../components/DeleteConfirmationTeam/DeleteConfirmationTeam.scss";
import { denyLogRequest } from "../../../../services/taskUpdateServices";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { toast } from "react-toastify";

const DenyRequest = ({ close }) => {
  const { currentUser } = useCurrentUserContext();
  const [reasonForDenial, setReasonForDenial] = useState("");
  const [denyRequestLoading, setDenyRequestLoading] = useState([]);

  const denyRequest = (element) => {
    setDenyRequestLoading([...denyRequestLoading, element._id])
    denyLogRequest(element._id, {
      reason_for_denial: reasonForDenial,
      denied_by: currentUser.userinfo.username,
    })
      .then((response) => {
        console.log(response.data);
        if(response.status === 200) {
            setDenyRequestLoading(
              denyRequestLoading.filter((id) => id !== element._id)
            );
            toast.success("Denied");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="overlay">
      <div className="delete_confirmation_container">
        <input
          type="text"
          placeholder="Reason for denial"
          onChange={(e) => setReasonForDenial(e.target.value)}
        />
        <div className="buttons">
          <button onClick={denyRequest} className="delete">
            Deny
          </button>
          <button onClick={close}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DenyRequest;
