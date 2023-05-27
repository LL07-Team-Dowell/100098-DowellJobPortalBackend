import { freelancingPlatforms } from "../../../CandidatePage/utils/jobFormApplicationData";
import DropdownButton from "../../../TeamleadPage/components/DropdownButton/Dropdown";

import "./style.css";


const PaymentDetails = ({ candidatePlatform, handlePlatformSelectionClick }) => {
    return <>
        <div className="payment-details-container">
            <div className="payment-info-container">
                <p>Payment</p>
                <DropdownButton currentSelection={'$30'} selections={['$30', '$35']} />
            </div>
            {
                candidatePlatform !== null && <div className="payment-info-container">
                    <p>Platform</p>
                    <DropdownButton currentSelection={candidatePlatform} selections={freelancingPlatforms} handleSelectionClick={handlePlatformSelectionClick} />
                </div>
            }
            
        </div>
    </>
}

export default PaymentDetails;
