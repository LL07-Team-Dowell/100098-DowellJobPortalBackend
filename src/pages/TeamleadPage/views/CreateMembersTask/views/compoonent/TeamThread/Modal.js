const Modal = ({ imageUrl, handleClose }) => {
  console.log(imageUrl);
  return (
    <div className="modal-container" onClick={handleClose}>
      <div className="modal_main_container">
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <img src={imageUrl} alt="thread" />
          <button className="close-btn" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
