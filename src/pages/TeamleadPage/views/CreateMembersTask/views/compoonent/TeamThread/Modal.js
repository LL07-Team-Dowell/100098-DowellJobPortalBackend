const Modal = ({ imageUrl, handleClose }) => {
    return (
      <div className="modal-container" onClick={handleClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <img src={imageUrl} alt="thread" />
          <button className="close-btn" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    );
  };
  
  export default Modal;
  