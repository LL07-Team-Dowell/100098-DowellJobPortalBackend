import './App.css';
import { Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage';
import ResearchAssociatePage from './pages/ResearchAssociatePage/ResearchAssociatePage';
import AdminPage from './pages/AdminPage/AdminPage';
import AddJob from './pages/AdminPage/views/AddJob/AddJob';
import ViewJob from './pages/AdminPage/views/ViewJob/ViewJob';
import EditJob from './pages/AdminPage/views/EditJob/EditJob';
import LandingPage from './pages/Landingpage/LandingPage';

function App() {
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
