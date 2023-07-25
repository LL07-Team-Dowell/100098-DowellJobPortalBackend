import image from '../../assets/images/user-not-found.jpg'
import './UserDetailNotFound.scss'
const UserDetailNotFound = () => {
    const handleReloadClick = () => {
        window.location.reload();
      };
    return <div className='user-detail-not-found-container'>
        <img src={image} alt='none' />
        <p>we cannot seem to find your details, it might be an error on our end</p>
        <p>you can try reloading the page using the button below</p>
        <button onClick={handleReloadClick}>Reload</button>
    </div>
}

export default UserDetailNotFound;