import image from '../../assets/images/user-not-found.jpg'
import './UserDetailNotFound.scss'
const UserDetailNotFound = () => {
    const handleReloadClick = () => {
        sessionStorage.clear();
        window.location.reload();
      };
    return <div className='user-detail-not-found-container'>
        <img src={image} alt='none' />
        <p>We cannot seem to find your details, you are either logged out or it might be an error on our end.</p>
        <br />
        <p>You can try reloading the application using the button below</p>
        <button onClick={handleReloadClick}>Reload</button>
    </div>
}

export default UserDetailNotFound;