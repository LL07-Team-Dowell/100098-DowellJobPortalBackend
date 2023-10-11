import { useState } from "react"
import { claimVoucher, getVouchar, verifyVouchar } from "../../../../services/teamleadServices"
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import './style.css'
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import LittleLoading from "../../../CandidatePage/views/ResearchAssociatePage/littleLoading";

export const ClaimVouchar = () => {
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
            setLoading(false)
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

export const ApproveVouchar = () => {
    const { currentUser } = useCurrentUserContext();
    const [showform, setShowForm] = useState(false);
    const [isClaimed, setIsClaimed] = useState(false);
    const [details, setDetails] = useState([]);
    console.log(details);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false)
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const [formData, setFormData] = useState({
        description: details.description,
        voucher_code: "",
        email: currentUser.userinfo.email
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const result = await getVouchar({
                "voucher_code": formData.voucher_code,
            });

            if (result.success) {
                // setShowForm(false);
                // setIsClaimed(true);
                setDetails([result.response]);
                toast.success(result)
                setFormData({
                    voucher_code: "",
                })
            }
            setLoading(false)
            console.log(result);  // You can handle the result as needed
        } catch (error) {
            setLoading(false)
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

    const handleVerify = async (e) => {
        setVerifyLoading(true)
        e.preventDefault();
        const id = details[0]._id;
        console.log(id);
        try {
            const result = await verifyVouchar(id);
            toast.success(result?.data?.message);
            setShowForm(!showform);
            setDetails([])
            setVerifyLoading(false)
            console.log(result);
        } catch (error) {
            setVerifyLoading(false)
            console.log(error);
        }
    }


    return <>
        <button onClick={() => setShowForm(!showform)} className="approve__button">{showform ? '' : 'Verify Voucher'}</button>
        {
            showform && (
                <div className="form__data" id="vouchar">
                    <form action="#">
                        <AiOutlineClose onClick={() => {
                            setShowForm(false);
                            setDetails([]);
                        }} />
                        <h2>Fill this form</h2>
                        <br />
                        <div className="des">
                            <label htmlFor="#">Vouchar Code</label>
                            <input type="text" name="voucher_code" value={formData.voucher_code} onChange={handleChange} required />
                        </div>
                        {
                            loading ? <LittleLoading /> : <button className="get_vouchar_button" onClick={(e) => handleSubmit(e)}>Get The Details</button>

                        }

                        {
                            details.length > 0 ?
                                <>
                                    <div className="vouchar_details">
                                        <br />
                                        <h3>Details of Vouchar</h3>
                                        <hr />
                                        <p>Voucher Name: {details[0]?.name}</p>
                                        <p>Claim Method: {details[0]?.claim_method}</p>
                                        <p>Redemption Status: {details[0]?.is_redeemed ? "Redeemed" : "Not Redeemed"}</p>
                                        <p>Description: {details[0]?.description}</p>
                                        <p>Verification status: {details[0]?.is_verified ? "Verified" : "Not Verified"}</p>
                                    </div>
                                    {
                                        details[0].is_verified == false ?
                                            verifyLoading ? <LittleLoading /> :
                                                <button className="get_vouchar_button" onClick={(e) => handleVerify(e)}>Verify</button> : ''
                                    }
                                </>
                                : " "
                        }


                    </form>

                </div>
            )
        }
    </>
}


export const Details = ({ details, verifyLoading, handleVerify }) => {
    console.log(details);
    return <div>
        <div className="vouchar_details">
            <h3>Details of Vouchar</h3>
            <hr />
            <p>Voucher Name: {details[0]?.name}</p>
            <p>Claim Method: {details[0]?.claim_method}</p>
            <p>Redemption Status: {details[0]?.is_redeemed ? "Redeemed" : "Not Redeemed"}</p>
            <p>Description: {details[0]?.description}</p>
            <p>Verification status: {details[0]?.is_verified ? "Verified" : "Not Verified"}</p>
        </div>
        {
            details[0].is_verified == false ?
                verifyLoading ? <LittleLoading /> :
                    <button className="get_vouchar_button" onClick={(e) => handleVerify(e)}>Verify</button> : ''
        }
    </div>
}
