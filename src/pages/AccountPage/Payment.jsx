import React from 'react'
import StaffJobLandingLayout from '../../layouts/StaffJobLandingLayout/StaffJobLandingLayout'
import { PageUnderConstruction } from '../UnderConstructionPage/ConstructionPage'

const Payment = () => {
  return (
    <StaffJobLandingLayout
      accountView={true}
      hideSearchBar={true}
    >
      <PageUnderConstruction />
    </StaffJobLandingLayout>
  )
}

export default Payment