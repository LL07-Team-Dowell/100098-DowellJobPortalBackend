import './App.css';
import { Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage';
import ResearchAssociatePage from './pages/CandidatePage/views/ResearchAssociatePage/ResearchAssociatePage';
import AdminPage from './pages/AdminPage/AdminPage';
import AddJob from './pages/AdminPage/views/AddJob/AddJob';
import ViewJob from './pages/AdminPage/views/ViewJob/ViewJob';
import EditJob from './pages/AdminPage/views/EditJob/EditJob';
import LandingPage from './pages/AdminPage/views/Landingpage/LandingPage';
import { useState } from 'react';
import useDowellLogin from './hooks/useDowellLogin';
import useTitle from './hooks/useTitle';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import { NavigationContextProvider } from './contexts/NavigationContext';
import { NewApplicationContextProvider } from './contexts/NewApplicationContext';
import { CandidateContextProvider } from './contexts/CandidatesContext';
import { HrCandidateContextProvider } from './contexts/HrCandidateContext';
import { CandidateTaskContextProvider } from './contexts/CandidateTasksContext';
import { CandidateJobsContextProvider } from './contexts/CandidateJobsContext';
import { useCurrentUserContext } from './contexts/CurrentUserContext';
import Logout from './pages/LogoutPage/Logout';
import JobApplicationScreen from './pages/CandidatePage/views/JobApplicationScreen/JobApplicationScreen';
import SingleJobScreen from './pages/CandidatePage/views/JobApplicationScreen/SingleJobScreen';
import JobScreen from './pages/CandidatePage/components/Job/Job';
import EmployeeJobScreen from './pages/CandidatePage/views/JobsLandingScreens/EmployeeJobLandingScreen';
import InternJobScreen from './pages/CandidatePage/views/JobsLandingScreens/InternJobLandingScreen';
import FreelancerJobScreen from './pages/CandidatePage/views/JobsLandingScreens/FreelancerJobScreen';
import CandidateHomeScreen from './pages/CandidatePage/views/CandidateHomeScreen/CandidateHomeScreen';
import AfterSelectionScreen from './pages/CandidatePage/views/AfterSelectionScreen/AfterSelectionScreen';
import AlertScreen from './pages/CandidatePage/views/AlertsScreen/AlertScreen';
import UserScreen from './pages/CandidatePage/views/UserScreen/UserScreen';
import AppliedScreen from './pages/CandidatePage/views/AppliedPageScreen/AppliedScreen';
import HrJobScreen from './pages/HrPage/views/JobScreen/HrJobScreen';
import Teamlead from './pages/TeamleadPage/Teamlead';
import AccountPage from './pages/AccountPage/AccountPage';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import IntermediatePage, { testingRoles } from './IntermediatePage';
import { JobContextProvider } from './contexts/Jobs';

function App() {
  const { currentUser, setCurrentUser } = useCurrentUserContext();
  const [loading, setLoading] = useState(true);
  const [ candidateHired, setCandidateHired ] = useState(false);
  const [ assignedProject, setAssignedProject ] = useState("");

  useDowellLogin(setCurrentUser, setLoading);
  useTitle("Dowell Job Portal");
  if (loading) return <LoadingSpinner />
  
  // NO LOGGED IN USER VIEW
  if (!currentUser) {
    return <Routes>
      
      <Route path="/apply/job/:id" element={
        <NewApplicationContextProvider>
          <JobApplicationScreen />
        </NewApplicationContextProvider>
      } />
      
      <Route path='/' element={<CandidateHomeScreen />} />

      <Route path='/jobs'>
        <Route index element={<JobScreen />} />
        <Route path=':jobTitle' element={<SingleJobScreen />} />
        <Route exact path='c/research-associate' element={<ResearchAssociatePage />} />
        <Route exact path='c/employee' element={<EmployeeJobScreen />} />
        <Route exact path='c/intern' element={<InternJobScreen />} />
        <Route exact path='c/freelancer' element={<FreelancerJobScreen />} />
      </Route>
      <Route path="*" element={<CandidateHomeScreen />} />

    </Routes>
  }

  // CURRENT USER BUT NO ROLES YET(WILL REMOVE)
  if (!currentUser.role) {
    return <Routes>
      <Route path='*' element={<IntermediatePage />} />
    </Routes>
  }

  // ACCOUNT PAGE
  if (currentUser.role === testingRoles.accountRole) {
    return <Routes>
      
      <Route path="/logout" element={<Logout/>}/>

      <Route path="/" element={
        <NavigationContextProvider>
          <CandidateContextProvider>
            <AccountPage />
          </CandidateContextProvider>
        </NavigationContextProvider>
      } >
        <Route path=':section' element={<AccountPage />} />
      </Route>

      <Route path='*' element={<ErrorPage />} />

    </Routes>
  }

  // ADMIN PAGE
  if (currentUser.role === testingRoles.adminRole) {

    return <Routes>

      <Route path="/" element={<JobContextProvider> <LandingPage /></JobContextProvider>} />
      <Route path="/logout" element={<JobContextProvider> <Logout/></JobContextProvider>}/>
      <Route path="/edit-job" element={<JobContextProvider><EditJob /></JobContextProvider>} />
      <Route path="/view-job" element={<JobContextProvider><ViewJob /></JobContextProvider>} />
      <Route path="/add-job" element={<JobContextProvider><AddJob /></JobContextProvider>} />
      <Route path='*' element={<JobContextProvider><ErrorPage /></JobContextProvider>} />

    </Routes>

  }

  // HR PAGE
  if (currentUser.role === testingRoles.hrRole) {

    return <Routes>

      <Route path="/logout" element={<Logout/>}/>
      
      <Route path="/" element={
        <NavigationContextProvider>
          <HrCandidateContextProvider>
            <CandidateTaskContextProvider>
              <HrJobScreen />
            </CandidateTaskContextProvider>
          </HrCandidateContextProvider>
        </NavigationContextProvider>
      }>
        <Route path=":section" element={
          <NavigationContextProvider>
            <HrJobScreen />
          </NavigationContextProvider>
        } >
          <Route path=":sub_section" element={
            <NavigationContextProvider>
              <HrJobScreen />
            </NavigationContextProvider>
          } >
            <Route path=":path" element={
              <NavigationContextProvider>
                <HrJobScreen />
              </NavigationContextProvider>
            } />
          </Route>
        </Route>
        
      </Route>

      <Route path='*' element={<ErrorPage />} />

    </Routes>
  }

  // TEAMLEAD PAGE
  if (currentUser.role === testingRoles.teamLeadRole) {

    return <Routes>

      <Route path="/logout" element={<Logout/>}/>

      <Route path="/" element={
        <NavigationContextProvider>
          <CandidateContextProvider>
            <CandidateTaskContextProvider>
              <Teamlead />
            </CandidateTaskContextProvider>
          </CandidateContextProvider>
        </NavigationContextProvider>
      } >
        <Route path=':section' element={<Teamlead />} />
      </Route>

      <Route path='*' element={<ErrorPage />} />
      
    </Routes>

  }

  // CANDIDATE PAGE
  if (currentUser.role === testingRoles.candidateRole) {
    return (
    candidateHired ? <Routes>

      <Route path='/' element={
        <NavigationContextProvider>
          <CandidateTaskContextProvider>
            <CandidateJobsContextProvider>
              <AfterSelectionScreen assignedProject={assignedProject} />
            </CandidateJobsContextProvider>
          </CandidateTaskContextProvider>
        </NavigationContextProvider>
      }>
        <Route path=':section' element={<AfterSelectionScreen />} />
      </Route>
      
      <Route path="/logout" element={<Logout/>}/>

      <Route path='*' element={<ErrorPage />} />

    </Routes> :

    <Routes>

      <Route path="/" element={
        <NavigationContextProvider>
          <CandidateJobsContextProvider>
            <CandidateHomeScreen setHired={setCandidateHired} setAssignedProject={setAssignedProject} />
          </CandidateJobsContextProvider>
        </NavigationContextProvider>
      }>
        <Route path=":section" element={
          <NavigationContextProvider>
            <CandidateJobsContextProvider>
              <CandidateHomeScreen />
            </CandidateJobsContextProvider>
          </NavigationContextProvider>
        } />
      </Route>

      <Route path='/jobs'>
        <Route index element={
          <CandidateJobsContextProvider>
            <JobScreen />
          </CandidateJobsContextProvider>
        } />
        <Route path=':jobTitle' element={
          <CandidateJobsContextProvider>
            <SingleJobScreen />
          </CandidateJobsContextProvider>
        } />
        <Route exact path='c/research-associate' element={<ResearchAssociatePage />} />
        <Route exact path='c/employee' element={
          <CandidateJobsContextProvider>
            <EmployeeJobScreen />
          </CandidateJobsContextProvider>
        } />
        <Route exact path='c/intern' element={
          <CandidateJobsContextProvider>
            <InternJobScreen />
          </CandidateJobsContextProvider>
        } />
        <Route exact path='c/freelancer' element={
          <CandidateJobsContextProvider>
            <FreelancerJobScreen />
          </CandidateJobsContextProvider>
        } />
      </Route>

      <Route path="/logout" element={<CandidateJobsContextProvider><Logout/></CandidateJobsContextProvider>}/>
      <Route path="/alerts" element={<CandidateJobsContextProvider><AlertScreen/></CandidateJobsContextProvider>}/>
      <Route path="/user" element={<CandidateJobsContextProvider><UserScreen candidateSelected={false} /></CandidateJobsContextProvider>}/>

      <Route path="/applied" element={ 
        <NavigationContextProvider>
          <CandidateJobsContextProvider>
            <AppliedScreen />
          </CandidateJobsContextProvider>
        </NavigationContextProvider>
      } >
        <Route path=":section" element={
          <NavigationContextProvider>
            <CandidateJobsContextProvider>
              <AppliedScreen />
            </CandidateJobsContextProvider>
          </NavigationContextProvider>
        } />
      </Route>
      
      <Route path="/apply/job/:id" element={
        <NewApplicationContextProvider>
            <CandidateJobsContextProvider>
              <JobApplicationScreen />
            </CandidateJobsContextProvider>
        </NewApplicationContextProvider>
        }>
          <Route path=":section" element={
            <NewApplicationContextProvider>
                <CandidateJobsContextProvider>
                  <JobApplicationScreen />
                </CandidateJobsContextProvider>
            </NewApplicationContextProvider>
          } />
      </Route>

      <Route path='*' element={<ErrorPage />} />

    </Routes>
    );
  }

  return (
    <>
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/research-jobs' element={<ResearchAssociatePage />} />
        <Route path='/admin'>
          <Route index element={<AdminPage />} />
          <Route path='add' element={<AddJob />} />
          <Route path='view' element={<ViewJob />} />
          <Route path='edit' element={<EditJob />} />
        </Route>
        <Route path='/landingpage' element={<LandingPage />} />

      </Routes>
    </>
  )
}

export default App;
