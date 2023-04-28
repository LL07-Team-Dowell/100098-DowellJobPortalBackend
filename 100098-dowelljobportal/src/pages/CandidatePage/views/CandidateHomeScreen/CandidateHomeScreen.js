import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mutableNewApplicationStateNames } from '../../../../contexts/NewApplicationContext';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import { candidateStatuses } from '../../utils/candidateStatuses';
import { availableJobCategories } from '../../utils/jobCategories';
import * as assets from '../../../../assets/assetsIndex';
import "./style.css";
import { useCandidateJobsContext } from '../../../../contexts/CandidateJobsContext';
import { useMediaQuery } from '@mui/material';
import { dowellLoginUrl } from '../../../../services/axios';
import { getCandidateApplications } from '../../../../services/commonServices';
import { useCurrentUserContext } from '../../../../contexts/CurrentUserContext';
import { getAppliedJobs } from '../../../../services/candidateServices';

function Home({ setHired, setAssignedProjects }) {

  const [loading, setLoading] = useState(true);
  const { candidateJobs, setCandidateJobs } = useCandidateJobsContext();
  const isLargeScreen = useMediaQuery("(min-width: 992px)");

  const { currentUser } = useCurrentUserContext();

  useEffect(() => {

    if (!currentUser) return setLoading(false);
    if (Array.isArray(candidateJobs.appliedJobs) && candidateJobs.appliedJobs.length > 0) return setLoading(false);

    getAppliedJobs(currentUser?.portfolio_info[0].org_id).then(res => {
      const userApplication = res.data.response.data.filter(
        (application) => application.data_type === currentUser?.portfolio_info[0].data_type
      )

      const currentUserAppliedJobs = userApplication.filter(
        (application) => application.username === currentUser.userinfo.username
      );
      const userSelectedJobs = currentUserAppliedJobs.filter(application => application.status === candidateStatuses.ONBOARDING);

      if (userSelectedJobs.length >= 1) {
        setAssignedProjects(userSelectedJobs.map((job) => job.project))
        setHired(true);
        setLoading(false);
        return;
      }

      setCandidateJobs((prevJobs) => { return { ...prevJobs, "appliedJobs": currentUserAppliedJobs } });
      setLoading(false);

    }).catch(err => {
      console.log(err);
      setLoading(false);
    })

  }, [])

  const handleLoginLinkClick = (e) => {
    e.preventDefault();
    window.location.href = dowellLoginUrl
  }

  if (loading) return <LoadingSpinner />

  return (
    <>
      <nav>
        <div className='candidate__Homepage__Nav__Container'>
          {!currentUser && <Link className='login__Link' to={dowellLoginUrl} onClick={handleLoginLinkClick}>Login</Link>}
        </div>
      </nav>
      <main className='candidate__Homepage__Container'>
        <section className='main__Content'>
          <div className='logo__Img__Container'>
            <img src={assets.logo_img} alt='dowell logo' />
          </div>
          <h1>Join DoWell team</h1>
          <div className='content__Wrappper'>
            <div className='content__Item'>
              {
                React.Children.toArray(availableJobCategories.slice(0, 2).map(category => {
                  return <Link to={`/jobs/c/${category.toLocaleLowerCase().replaceAll(' ', '-')}`}>
                    <img src={assets.users_img_1} alt='job category' />
                  </Link>
                }))
              }
              {/* <div className='bottom__Content'>
                {
                  React.Children.toArray(availableJobCategories.slice(0, 2).map(category => {
                    return <Link className='job__Link__Item' to={`/jobs/c/${category.toLocaleLowerCase().replaceAll(' ', '-')}`}>
                      <>
                        Apply for
                        {
                          category === "Employee" ? " Full time Employment" :
                            ` Full time/Part time ${category} ${category === "Freelancer" ? 'jobs' : ''}`
                        }
                      </>
                    </Link>
                  }))
                }

              </div> */}
            </div>
            <div className='content__Item'>
              {
                React.Children.toArray(availableJobCategories.slice(2).map(category => {
                  return <Link to={`/jobs/c/${category.toLocaleLowerCase().replaceAll(' ', '-')}`}>
                    <img src={assets.users_img_2} alt='job category' />
                  </Link>
                }))
              }
              {/* <div className='bottom__Content'>
                {
                  React.Children.toArray(availableJobCategories.slice(2).map(category => {
                    return <Link className='job__Link__Item' to={`/jobs/c/${category.toLocaleLowerCase().replaceAll(' ', '-')}`}>
                      <>
                        Apply for
                        {
                          category === "Employee" ? " Full time Employment" :
                            ` Full time/Part time ${category} ${category === "Freelancer" ? 'jobs' : ''}`
                        }
                      </>
                    </Link>
                  }))
                }

              </div> */}
            </div>
          </div>
        </section>
        {isLargeScreen && <aside>
          <div className='side__Content'>
            <img src={assets.map_img} alt='dowell on the map' />
            <video width={'100%'} controls>
              <source src={assets.dowell_video}></source>
            </video>
            <p>DoWell is the right place to "fail", if you are innovating !!</p>
          </div>
        </aside>}
      </main>
      {/* <div className='container-wrapper candidate__Home__Page'>
        <h1 className='home__Title__Text'>Welcome to dowell job portal!</h1>
        <div className='row'>
          {
            React.Children.toArray(availableJobCategories.map(category => {
              return <>
                <div className='card'>
                  <div className='container'>
                    <div className='row-text'>
                      <h4><b>{category} Jobs</b></h4>
                      <p className='detail dowell'>Dowell Ux living lab</p>
                      <p className='detail skill full-width'>{category} jobs on dowell</p>  
                      <button className='apply-button' >View</button>                     
                    </div>
                  </div>
                </div>
              </>
            }))
          }
        </div>
      </div> */}
    </>
  )
}

export default Home