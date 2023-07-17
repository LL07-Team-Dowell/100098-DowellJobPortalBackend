import { AiOutlineClose, AiOutlineLink } from 'react-icons/ai';
import styles from './styles.module.css';
import { IoCopyOutline, IoLogoWhatsapp } from 'react-icons/io5';
import { FaFacebook, FaTwitter } from 'react-icons/fa';
import React from 'react';
import { Tooltip } from 'react-tooltip';
import { useState } from 'react';
import { toast } from 'react-toastify';


const ShareJobModal = ({ linkToShare, handleCloseModal }) => {

    const [ copyOptionActive, setCopyOptionActive ] = useState(false);
    const [ activeItemId, setActiveItemId ] = useState(null);
    const [ mouseOverShareLinkContainer, setMouseOverShareLinkContainer ] = useState(false);

    const handleShareItem = async (optionPassed) => {
        // console.log(linkToShare);

        switch (optionPassed?.type) {
            case 'facebook':
                window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${linkToShare}`,
                    '_blank'
                )
                handleCloseModal();
                break;
            case 'twitter':
                window.open(
                    `https://twitter.com/intent/tweet?text=${linkToShare}`,
                    '_blank'
                )
                handleCloseModal();
                break;
            case 'whatsapp':
                window.open(
                    `https://api.whatsapp.com/send?&text=${linkToShare}`,
                    '_blank'
                )
                handleCloseModal();
                break;
            case 'link':
                setActiveItemId(optionPassed._id);
                setCopyOptionActive(true);
                break;
            default:
                console.log('Invalid action passed');
                handleCloseModal();
                break;
        }
        
    }

    const handleCopyLink = async () => {
        await navigator.clipboard.writeText(decodeURIComponent(linkToShare));
        toast.success('Link copied to clipboard!')
        handleCloseModal();
    }

    return <>
        <div className={styles.share__Overlay}>
            <div className={styles.share__Modal}>
                <div className={styles.share__Modal__CLose__Container}>
                    <AiOutlineClose 
                        className={styles.share__Modal__CLose__Icon} 
                        onClick={handleCloseModal}
                    />
                </div>
                <div>
                    <h2>Share Job</h2>
                    <p className={styles.share__Subtitle__Info}>Share a link for this job to platforms for people to apply</p>
                </div>
                <ul className={styles.share__Items__Container}>
                    {
                        React.Children.toArray(shareOptions.map(option => {
                            return <>
                                <li 
                                    onClick={() => handleShareItem(option)}
                                    className={`${styles.share__Item} ${activeItemId === option._id ? styles.active : ''}`}
                                    data-tooltip-id={option._id} 
                                    data-tooltip-content={option.title}
                                >
                                    <span>{option.icon}</span>
                                </li>
                                <Tooltip id={option._id} />
                            </>
                        }))
                    }
                </ul>

                {
                    copyOptionActive && <>
                        <div 
                            className={styles.link__Wrapper}
                            onMouseOver={() => setMouseOverShareLinkContainer(true)}
                            onMouseLeave={() => setMouseOverShareLinkContainer(false)}
                            onClick={() => handleCopyLink()}
                        >
                            <pre 
                                className={styles.link__Content} 
                            >
                                <span>{linkToShare}</span>
                            </pre>
                            { 
                                mouseOverShareLinkContainer && <div className={styles.copy__Link__Icon}>
                                    <IoCopyOutline />
                                </div> 
                            }
                        </div>
                        <button 
                            className={styles.copy__Link__Btn}
                            onClick={() => handleCopyLink()}
                        >
                            Copy
                        </button>    
                    </>
                }
                
            </div>
        </div>
    </>
}


const shareOptions = [
    {
        title: 'Share to Facebook',
        icon: <FaFacebook />,
        type: 'facebook',
        _id: crypto.randomUUID(),
    },
    {
        title: 'Share to Twitter',
        icon: <FaTwitter />,
        type: 'twitter',
        _id: crypto.randomUUID(),
    },
    {
        title: 'Share on WhatsApp',
        icon: <IoLogoWhatsapp />,
        type: 'whatsapp',
        _id: crypto.randomUUID(),
    },
    {
        title: 'Share link',
        icon: <AiOutlineLink />,
        type: 'link',
        _id: crypto.randomUUID(),
    },
]

export default ShareJobModal;
