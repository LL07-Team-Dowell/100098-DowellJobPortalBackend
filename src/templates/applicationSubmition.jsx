const ApplicationSubmissionContent = ({ name, job }) => {
    return <>
        <div style={{ margin: '0 auto', padding: 0, boxSizing: 'border-box', textAlign: 'center', width: '80%' }}>
            <div>
                <img src="http://67.217.61.253/hr/logo-2-min-min.png" style={{ width: '70px', height: '70px' }} alt="logo" />
                <h5 style={{ fontSize: '25px', color: '#005734', fontWeight: 700 }}>Hello {name},</h5>
                <img src='https://img.freepik.com/free-vector/one-man-sending-letter-envelope-another-using-electronic-mail-writing-letter-email-comparison-flat-illustration_74855-20667.jpg?size=626&ext=jpg&ga=GA1.1.225976907.1673277028&semt=sph' style={{ width: '300px', height: '300px', objectFit: 'contain' }} alt="" />
                <p>You just took the first step by submitting an application.</p>
                <br />
                <p>We have successfully received your application for {job}.</p>
                <p>A member of our hr team will extensively review it and get back to you if you meet our requirements. </p>
                <br />
            </div>
            
            <p style={{ fontWeight: 700, color: '#005734'}}>Good luck!</p>
        </div>
    </>
}

export default ApplicationSubmissionContent;