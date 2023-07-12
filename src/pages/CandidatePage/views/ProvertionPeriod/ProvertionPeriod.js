import React from 'react';
import styled from 'styled-components';

const TextUp = styled.section`
    position: fixed;
    top: 10px;  
    left: 50%; 
    transform: translate(-50%, -50%);
    z-index:1000;
    color: red;
    font-weight: 500;
`

const ProvertionPeriod = ({ children }) => {
    return (
        <div>
            <TextUp>You are in a probationary period</TextUp>
            {children}
        </div>
    )
}

export default ProvertionPeriod;
