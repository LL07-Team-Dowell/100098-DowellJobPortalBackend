import React, { useState, useReducer } from "react";
import Overlay from "../../../../components/Overlay";
import { AiOutlineClose } from "react-icons/ai";
import "./styles.css";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { useJobContext } from "../../../../contexts/Jobs";
import { addEvents } from "../../../../services/eventServices";
import { candidateStatuses } from "../../../CandidatePage/utils/candidateStatuses";
import Select from "react-select";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddEventsPopup = ({
  handleCloseModal,
  setShowEventsPop,
  forceUpdateEvent,
}) => {
  const { currentUser } = useCurrentUserContext();
  const { applications } = useJobContext();
  const [eventFrequency, setEventFrequency] = useState("");
  const [eventType, setEventType] = useState("");
  const [dataPosting, setDataPosting] = useState(false);
  const [selectedEventHost, setSelectedEventHost] = useState(null);
  const navigate = useNavigate();

  const [addEvent, setAddEvent] = useState({
    company_id: currentUser.portfolio_info[0].org_id,
    event_name: "",
    event_frequency: "",
    data_type: currentUser.portfolio_info[0].data_type,
    event_host: "",
    event_type: "",
    is_mendatory: true,
  });

  const onboardedApplicants = applications.filter(
    (application) => application.status === candidateStatuses.ONBOARDING
  );

  console.log(onboardedApplicants);

  const handleChange = (valueEntered, inputName) => {
    setAddEvent((prevValue) => {
      const copyOfPrevValue = { ...prevValue };
      copyOfPrevValue[inputName] = valueEntered;
      return copyOfPrevValue;
    });
  };

  const handleEventFrequencyChange = (e) => {
    setEventFrequency(e.target.value);
    setAddEvent((prevValue) => {
      const copyOfPrevValue = { ...prevValue };
      copyOfPrevValue["event_frequency"] = e.target.value;
      return copyOfPrevValue;
    });
  };

  const handleEventTypeChange = (e) => {
    setEventType(e.target.value);
    setAddEvent((prevValue) => {
      const copyOfPrevValue = { ...prevValue };
      copyOfPrevValue["event_type"] = e.target.value;
      return copyOfPrevValue;
    });
  };

  const handleUpdate = () => {
    setDataPosting(true);
    const fetchEventDetails = async () => {
      try {
        const eventDetails = await addEvents(addEvent);
        setAddEvent((prevDetails) => {
          return { ...prevDetails, ...addEvent };
        });
        setShowEventsPop();
        toast.success("Events successfully added");
        forceUpdateEvent();

        console.log(eventDetails);
      } catch (error) {
        console.log(console.error("Error fetching project details:", error));
        toast.error("Something went wrong");
      }
    };

    setDataPosting(false);

    fetchEventDetails();
  };

  return (
    <>
      <Overlay>
        <div className="edit_modal_event">
          <div style={{ width: "100%" }}>
            <AiOutlineClose
              onClick={handleCloseModal}
              className="edit_Icon_event"
            />
          </div>
          <h2>Add New Event</h2>

          <label htmlFor="event_name">
            <span>Event Name</span>
            <input
              type="text"
              className="select_Item_event"
              id="event_name"
              name="event_name"
              placeholder="Enter Event name"
              value={addEvent.event_name}
              onChange={(e) => handleChange(e.target.value, e.target.name)}
            />
          </label>

          <label htmlFor="event_host">
            <span>Event Host</span>
            <Select
              options={onboardedApplicants.map((applicant) => {
                return {
                  label: applicant.applicant,
                  value: applicant.username,
                };
              })}
              onChange={(selectedOption) => {
                setAddEvent((prevValue) => ({
                  ...prevValue,
                  event_host: selectedOption.value,
                }));
                setSelectedEventHost(selectedOption);
              }}
            />
          </label>

          <label htmlFor="event_frequency">Event Frequency</label>
          <select
            className="event_frequency"
            name={"event_frequency"}
            id="event_frequency"
            onChange={handleEventFrequencyChange}
          >
            <option value="">Select Frequency</option>
            <option value="daily" selected={eventFrequency === "daily"}>
              Daily
            </option>
            <option value="weekly" selected={eventFrequency === "weekly"}>
              Weekly
            </option>
            <option
              value="twice_a_week"
              selected={eventFrequency === "twice_a_week"}
            >
              Twice a week
            </option>
            <option value="monthly" selected={eventFrequency === "monthly"}>
              Monthly
            </option>
            <option value="yearly" selected={eventFrequency === "yearly"}>
              Yearly
            </option>
          </select>

          <label htmlFor="event_type">Event Type</label>
          <select
            className="event_type"
            name={"event_type"}
            id="event_type"
            onChange={handleEventTypeChange}
          >
            <option value="">Select Type</option>
            <option value="Meeting" selected={eventType === "Meeting"}>
              Meeting
            </option>
            <option value="Event" selected={eventType === "Event"}>
              Event
            </option>
          </select>

          <label htmlFor="is_mendatory" className="radio">
            <input
              className="radio_input"
              type="checkbox"
              name={"is_mendatory"}
              checked={addEvent.is_mendatory}
              onChange={(e) => handleChange(e.target.checked, e.target.name)}
            />
            <div className="radio__radio"></div>
            <p>Is Mandatory ?</p>
          </label>

          <div className="project__btn">
            <button
              className="project__submit"
              onClick={handleUpdate}
              disabled={dataPosting ? true : false}
            >
              {dataPosting ? (
                <LoadingSpinner
                  width={"1.2rem"}
                  height={"1.2rem"}
                  color={"#fff"}
                />
              ) : (
                "Update"
              )}
            </button>
          </div>
        </div>
      </Overlay>
    </>
  );
};

export default AddEventsPopup;
