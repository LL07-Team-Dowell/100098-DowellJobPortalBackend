import React, { useState, useReducer } from "react";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { PageUnderConstruction } from "../../../UnderConstructionPage/ConstructionPage";
import "./styles.css";
import { AiOutlinePlus } from "react-icons/ai";
import { useJobContext } from "../../../../contexts/Jobs";
import { useEffect } from "react";
import { getAllEvents } from "../../../../services/hrServices";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { HiOutlineDotsVertical } from "react-icons/hi";
import Overlay from "../../../../components/Overlay";
import { AiOutlineClose } from "react-icons/ai";
import { candidateStatuses } from "../../../CandidatePage/utils/candidateStatuses";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import AddEventsPopup from "./AddEventsPopUp";
import EditEventsPopup from "./EditEventPopup";

const EventScreen = () => {
  const [showEventsPop, setShowEventsPop] = useState(false);
  const { projectsLoading } = useJobContext();
  const { currentUser } = useCurrentUserContext();
  const [events, setEvents] = useState([]);
  const [showEditOptions, setShowEditOptions] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [reducerEvent, forceUpdateEvent] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    getAllEvents({ company_id: currentUser.portfolio_info[0].org_id }).then(
      (res) => {
        console.log(res.data.data);
        const eventDetails = res?.data?.data;
        setEvents(eventDetails);
        console.log(events);
      }
    );
  }, [reducerEvent]);

  const showEventsPopup = () => {
    setShowEventsPop(true);
  };

  const handleUpdateEvent = (eventssId) => {
    setShowEditModal((prevEditOption) => ({
      ...prevEditOption,
      [eventssId]: true,
    }));
    setShowEditOptions(false);
  };

  const showUpdate = (eventssId) => {
    setShowEditOptions((prevEditOption) => ({
      ...prevEditOption,
      [eventssId]: true,
    }));
  };

  const handleCloseModal = (eventssId) => {
    setShowEventsPop(false);
    setShowEditModal((prevEditOption) => ({
      ...prevEditOption,
      [eventssId]: false,
    }));
  };

  return (
    <StaffJobLandingLayout
      adminView={true}
      adminAlternativePageActive={true}
      pageTitle={"Events"}
      newSidebarDesign={true}
    >
      <div className="wrapper_event">
        <section className="top__Nav__Content__edit">
          <h2>Events</h2>
          <button
            onClick={projectsLoading ? () => {} : () => showEventsPopup()}
          >
            <AiOutlinePlus />
            <span>Add</span>
          </button>
        </section>
        <div className="event_cards">
          {React.Children.toArray(
            events.map((eventss) => {
              return (
                <div className="event_card">
                  <div className="event_card_header">
                    <h2>{eventss.project}</h2>
                    <div
                      className="edit__App"
                      onClick={() => showUpdate(eventss._id)}
                    >
                      <HiOutlineDotsVertical />
                    </div>
                  </div>
                  <div className="event_card_description">
                    <h3>Event Name: {eventss.event_name}</h3>
                    <h3>Event Host: {eventss.event_host}</h3>
                  </div>
                  {showEditOptions[eventss._id] && (
                    <ul className="update__Listing">
                      <li
                        className="item"
                        onClick={() => handleUpdateEvent(eventss._id)}
                      >
                        Update
                      </li>
                    </ul>
                  )}
                  {showEditModal[eventss._id] && (
                    <EditEventsPopup
                      handleCloseModal={() => handleCloseModal(eventss._id)}
                      setShowEventsPop={() => setShowEventsPop(false)}
                      forceUpdateEvent={forceUpdateEvent}
                    />
                  )}
                </div>
              );
            })
          )}
          {showEventsPop && (
            <AddEventsPopup
              handleCloseModal={handleCloseModal}
              setShowEventsPop={() => setShowEventsPop(false)}
              forceUpdateEvent={forceUpdateEvent}
            />
          )}
        </div>
      </div>
    </StaffJobLandingLayout>
  );
};
export default EventScreen;
