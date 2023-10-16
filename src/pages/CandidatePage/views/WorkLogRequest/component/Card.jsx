import React from "react";
// asd
const Card = ({
  username,
  update_task_date,
  project,
  update_reason,
  updateTask,
  approve,
  deny,
  handleBtnClick,
  handleApproveBtnClick,
  handleDenyBtnClick
}) => {
  return (
    <div className="card__work__log__request">
      <h2>{project}</h2>
      <p>Date of request: {new Date(update_task_date).toDateString()}</p>
      <p>Request reason: {update_reason}</p>
      {updateTask && <button className="update__action__btn" onClick={handleBtnClick}>Update Task</button>}
      <div className="request__action__btn">
        {approve && <button className="req__act__btn " onClick={handleApproveBtnClick}>Approve</button>}
        {deny && <button className="req__act__btn" onClick={handleDenyBtnClick}>Deny</button>}
      </div>
    </div>
  );
};

export default Card;
function formatDate(inputDate) {
  const [day, month, year] = inputDate.split("/").map(Number);

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return "Invalid date format";
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const inputFullYear = year < 100 ? year + 2000 : year;

  const date = new Date(inputFullYear, month - 1, day);
  const dayName = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][date.getUTCDay()];

  const formattedDate = `${dayName}, ${day} ${
    months[month - 1]
  } ${inputFullYear}`;
  return formattedDate;
}
