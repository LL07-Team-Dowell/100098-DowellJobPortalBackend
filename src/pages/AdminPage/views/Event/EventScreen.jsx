import React, { useState, useReducer } from "react";
import StaffJobLandingLayout from "../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout";
import { PageUnderConstruction } from "../../../UnderConstructionPage/ConstructionPage";
import styles from "./styles.module.css";
import { AiOutlinePlus } from "react-icons/ai";
import { useJobContext } from "../../../../contexts/Jobs";
import { useEffect } from "react";
import { getAllEvents } from "../../../../services/hrServices";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import { HiOutlineDotsVertical } from "react-icons/hi";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import EventsPopup from "./EventsPopUp";

const EventScreen = () => {
  const [showEventsPop, setShowEventsPop] = useState(false);
  const { projectsLoading } = useJobContext();
  const { currentUser } = useCurrentUserContext();
  const [events, setEvents] = useState([]);
  const [showEditOptions, setShowEditOptions] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [reducerEvent, forceUpdateEvent] = useReducer((x) => x + 1, 0);
  const [eventsLoading, setEventsLoading] = useState(false);

  useEffect(() => {
    setEventsLoading(true);
    getAllEvents({ company_id: currentUser.portfolio_info[0].org_id }).then(
      (res) => {
        console.log(res.data.data);
        const eventDetails = res?.data?.data;
        const sortedEvents = eventDetails.reverse();
        setEvents(sortedEvents);
        setEventsLoading(false);
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
      <div className={styles.wrapper_event}>
        <section className={styles.top__Nav__Content__edit}>
          <h2>Events</h2>
          <button
            onClick={projectsLoading ? () => {} : () => showEventsPopup()}
          >
            <AiOutlinePlus />
            <span>Add</span>
          </button>
        </section>
        {eventsLoading ? (
          <LoadingSpinner />
        ) : (
          <div className={styles.event_cards}>
            {React.Children.toArray(
              events.map((eventss) => {
                return (
                  <div className={styles.event_card}>
                    <div className={styles.event_card_header}>
                      <h2>{eventss.event_name}</h2>
                      <div
                        className={styles.edit__App}
                        onClick={() => showUpdate(eventss._id)}
                      >
                        <HiOutlineDotsVertical />
                      </div>
                    </div>
                    <div className={styles.event_card_description}>
                      <h3>Host: {eventss.event_host}</h3>
                      {eventss.project ? (
                        <h3>Project: {eventss.project}</h3>
                      ) : (
                        <></>
                      )}
                    </div>
                    {showEditOptions[eventss._id] && (
                      <ul className={styles.update__Listing_event}>
                        <li
                          className={styles.item}
                          onClick={() => handleUpdateEvent(eventss._id)}
                        >
                          Edit
                        </li>
                      </ul>
                    )}
                    {showEditModal[eventss._id] && (
                      <EventsPopup
                        handleCloseModal={() => handleCloseModal(eventss._id)}
                        setShowEventsPop={() => setShowEventsPop(false)}
                        forceUpdateEvent={forceUpdateEvent}
                        id={eventss._id}
                      />
                    )}
                  </div>
                );
              })
            )}
            {showEventsPop && (
              <EventsPopup
                handleCloseModal={handleCloseModal}
                setShowEventsPop={() => setShowEventsPop(false)}
                forceUpdateEvent={forceUpdateEvent}
              />
            )}
          </div>
        )}
      </div>
    </StaffJobLandingLayout>
  );
};
export default EventScreen;
