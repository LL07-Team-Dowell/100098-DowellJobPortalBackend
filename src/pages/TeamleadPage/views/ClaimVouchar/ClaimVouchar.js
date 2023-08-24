import { useState } from "react"
import { claimVoucher } from "../../../../services/teamleadServices"
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import './style.css'
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import LittleLoading from "../../../CandidatePage/views/ResearchAssociatePage/littleLoading";

const ClaimVouchar = () => {
    const { currentUser } = useCurrentUserContext();
    const [showform, setShowForm] = useState(false);
    console.log(showform);
    const [isClaimed, setIsClaimed] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    console.log(couponCode);
    const [formData, setFormData] = useState({
        description: "",
        email: currentUser.userinfo.email
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setLoading(true)
        try {
            const result = await claimVoucher({
                "claim_method": "INTERNAL CREDIT COUPONS",
                "description": formData.description,
                "timezone": timeZone,
                "email": formData.email
            });

            if (result.success) {
                setShowForm(false);
                setIsClaimed(true);
                setCouponCode(result.coupon);
                setMessage(result.message);
                toast.success(result.message)
                setFormData({
                    description: "",
                    email: currentUser.userinfo.email
                })
            }
            setLoading(false)
            console.log(result);  // You can handle the result as needed
        } catch (error) {
            console.error(error);  // Handle errors appropriately
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    }

    const handleCopyClick = () => {
        if (couponCode) {
            const tempInput = document.createElement('input');
            tempInput.value = couponCode;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            setIsClaimed(false);
            toast.success("Copied!!!")
        }
    };




    return <>
        <button onClick={() => setShowForm(!showform)} className="claim__button">{showform ? '' : 'Claim Voucher'}</button>
        {
            showform && (
                <div className="form__data">
                    <form action="#">
                        <AiOutlineClose onClick={() => setShowForm(!showform)} />
                        <h2>Fill this form</h2>
                        <br />
                        <div className="des">
                            <label htmlFor="#">Description</label>
                            <input type="text" name="description" value={formData.description} onChange={handleChange} required />
                        </div>
                        <br />

                        <div className="mail">
                            <label htmlFor="#">Email</label>
                            <input type="text" name="email" value={formData.email} onChange={handleChange} />
                        </div>
                        <br />
                        {
                            loading ? <LittleLoading /> : <button onClick={(e) => handleSubmit(e)}>Submit</button>

                        }
                    </form>
                </div>
            )
        }
        {isClaimed && couponCode && (
            <div className="form__data">
                <div className="coupon__data">
                    <p>{message}. Copy the coupon for future use
                        <br /> <br /> <span>{couponCode}</span>
                    </p>
                    <br />
                    <button onClick={handleCopyClick}>Copy</button>
                </div>
            </div>
        )}
    </>
}


export default ClaimVouchar;