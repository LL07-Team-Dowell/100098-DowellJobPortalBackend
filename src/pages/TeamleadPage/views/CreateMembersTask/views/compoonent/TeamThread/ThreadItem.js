import styled from '@emotion/styled';
import React from 'react';

const Wrapper = styled.div`

.header-items {
    display: flex;
    width: 20rem;
    justify-content: space-around;
    margin-top: 1rem;
}
`

const ThreadItem = () => {
    return (
        <Wrapper>
            <div className="outside-containre">
                <div className="section">
                    <div className="header-items">
                        <h3>In progress</h3>
                        <h3>Completed</h3>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}

export default ThreadItem;
