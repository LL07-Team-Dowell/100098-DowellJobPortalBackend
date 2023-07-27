import React, {useState,useEffect}from 'react'
import './Add.scss'
import StaffJobLandingLayout from '../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout'
import { MdArrowBackIos } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { AiOutlineClose, AiOutlinePlusCircle } from 'react-icons/ai'
import { useCurrentUserContext } from '../../../../contexts/CurrentUserContext'
import { FaTimes } from 'react-icons/fa'
import { BsPlus } from 'react-icons/bs'
import { toast } from 'react-toastify'
import { dowellProjects } from '../../../../utils/utils'
import { useJobContext } from '../../../../contexts/Jobs'
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner'
import { adminAddSettingUserProject, adminEditSettingUserProject } from '../../../../services/adminServices'
import { getSettingUserProject } from '../../../../services/hrServices'

const Add = () => {
  
  const navigate = useNavigate() 
  const [showProjectsPop, setShowProjectsPop] = useState(false)
  const showProjectPopup = () => {
    setShowProjectsPop(true)
  }
  const unshowProjectPopup = () => {
    setShowProjectsPop(false)
  }
  const {
    projectsLoading,
    projectsLoaded, 
    setProjectsLoaded,
    setProjectsLoading,
    setProjectsAdded,
  } = useJobContext();
  const { currentUser } = useCurrentUserContext();

  useEffect(() => {
    
    if (!projectsLoaded) {
      getSettingUserProject().then(res => {
        setProjectsLoading(false);
        setProjectsLoaded(true);

        const projectsGotten = res.data
        ?.filter(
          (project) =>
            project?.data_type === currentUser.portfolio_info[0].data_type &&
            project?.company_id === currentUser.portfolio_info[0].org_id &&
            project.project_list &&
            project.project_list.every(
              (listing) => typeof listing === "string"
            )
        )
        ?.reverse()

        if (projectsGotten.length < 1) return

        setProjectsAdded(projectsGotten);

      }).catch(err => {
        console.log(err);
        setProjectsLoading(false);
      })
    }

  }, [])

  return (
    <StaffJobLandingLayout
      adminView={true}
      adminAlternativePageActive={true}
      hideTitleBar={false}
      pageTitle={"Add Item"}
      showAnotherBtn={true}
      btnIcon={<MdArrowBackIos size="1.5rem" />}
      handleNavIcon={() => navigate(-1)}
      hideSideBar={showProjectsPop}
    >
       <div className="new__task__container">
        <h1 style={{ color: "#005734", fontSize: "1.6rem" }}>Add New Item</h1>
        <div style={{ position: "relative", display: "flex", gap: "3rem" }} >
          <div style={{ marginTop: 30 }} className="Create_Team" onClick={()=>navigate('/add-job')}>
            <div>
              <div>
                <AiOutlinePlusCircle
                  className="icon"
                  style={{ fontSize: "2rem" }}
                />
              </div>
              <h4>Add Job</h4>
              <p>
                Lorem, ipsum dolor sit amet adipisicing elit. Ex sunt eius in, consectetur laudantium a, obcaecati repudiandae 
              </p>
            </div>
          </div>
          <div style={{ marginTop: 30 }} className="Create_Team" onClick={projectsLoading ? () => {} : () => showProjectPopup()}  >
            <div>
              <div>
                <AiOutlinePlusCircle
                  className="icon"
                  style={{ fontSize: "2rem" }}
                />
              </div>
              <h4>Add Project</h4>
              {
                projectsLoading ? 
                  <div style={{ margin: '1rem auto', width: 'max-content', backgroundColor: '#fff' }}>
                    <LoadingSpinner />
                  </div>
                :
                  <p>
                    Lorem, ipsum dolor sit amet adipisicing elit. Ex sunt eius in, consectetur laudantium a, obcaecati repudiandae 
                  </p>  
              }
            </div>
          </div>
          <div style={{ marginTop: 30 }} className="Create_Team" onClick={() => toast.info('Still in development')}  >
            <div>
              <div>
                <AiOutlinePlusCircle
                  className="icon"
                  style={{ fontSize: "2rem" }}
                />
              </div>
              <h4>Add team</h4>
              <p>
              Bring everyone together and get to work. Work together in a team to increase productivity.
              </p>
            </div>
          </div>
        </div>
      </div>
     { showProjectsPop &&  <AddProjectPopup 
      unshowProjectPopup={unshowProjectPopup}
      />}
    </StaffJobLandingLayout>
  )
}

export default Add

const AddProjectPopup = ({projects, unshowProjectPopup}) => {
  const { currentUser } = useCurrentUserContext();
  const [query, setquery] = useState('')
  const [inputProjects,setInputProjects] = useState([])
  const [displayedProjects, setDisplayedProjects] = useState([]);
  const { 
    projectsAdded, 
    setProjectsAdded, 
  } = useJobContext();
  const [ btnDisabled, setBtnDisabled ] = useState(false);
  
  useEffect(() => {

    const projectsToDisplay = dowellProjects.filter(project => !projectsAdded[0]?.project_list.includes(project.project_name));
    setDisplayedProjects(projectsToDisplay);
    setInputProjects(Array.isArray(projectsAdded[0]?.project_list) ? projectsAdded[0]?.project_list : []);
  
  }, [])

  // functions
  const removeProject = (projectName) => {
    setInputProjects(inputProjects.filter(f => f !== projectName))

    const projectExistsInBank = dowellProjects.find(p => p.project_name === projectName);
    if (!projectExistsInBank) return

    const currentDisplayedProjects = displayedProjects.slice();
    const projectAmongDisplayedProjects = currentDisplayedProjects.find(project => project.project_name === projectName);
    if (projectAmongDisplayedProjects) return

    setDisplayedProjects([{ _id: crypto.randomUUID(), project_name: projectName }, ...displayedProjects])
  }

  const AddedProject = (projectName) => {
    setInputProjects([...inputProjects, projectName])
    setDisplayedProjects(displayedProjects?.filter(f => f.project_name !== projectName))

    setquery('');
  }

  const postSettinguserproject = async () => {
    if(inputProjects.length > 0){
      setBtnDisabled(true);

      const data = {
        company_id: currentUser?.portfolio_info[0].org_id,
        data_type: currentUser.portfolio_info[0].data_type,
        project_list: inputProjects
      }

      if (projectsAdded[0]?.project_list) {
        try {
          const response = (await adminEditSettingUserProject(projectsAdded[0]?.id, data)).data;
          // console.log(response);
          unshowProjectPopup()
          setProjectsAdded([{...data, id: response?.id}])
          toast.success('Projects successfully updated')
        } catch (error) {
          console.log(error)
          setBtnDisabled(false);
          toast.error("Something went wrong while trying to update projects")
        }
        return
      }


      adminAddSettingUserProject(data)
        .then(resp => {
          console.log(resp)
          unshowProjectPopup()
          setProjectsAdded([{...data, id: resp.data.id}])
          toast.success('Projects successfully added')
        })
        .catch(err => {
          console.log(err)
          setBtnDisabled(false);
          toast.error("Something went wrong while trying to add projects")
        })
    }else{
      toast.info('Please add a project')
      setBtnDisabled(false);
    }
  }

  return (
    <div className="overlay">
      <div className="Project_Popup">
        <AiOutlineClose
          fontSize={"small"}
          style={{ display: "block", margin: "0 0 0 auto", cursor: "pointer", fontSize: "1rem" }}
          onClick={unshowProjectPopup}
        />
        <h2 style={{ marginBottom: 15, color: "#005734", letterSpacing: '0.03em' }}>Select Projects </h2>
        <div className="added-members-input">
          {
            React.Children.toArray(inputProjects?.map((v) => (
              <div
                // key={v.id}
                style={{ cursor: "pointer" }}
                onClick={() => removeProject(v)}
              >
                <p>{v}</p>
                <FaTimes fontSize={"small"} />
              </div>
            )))
          }
          <input
            type="text"
            placeholder="Search project"
            value={query}
            onChange={(e) => setquery(e.target.value.replaceAll(' ', ''))}
          />
        </div>
        <br />
        <label htmlFor="task_name">Add Projects</label>
        <div className="members">
          {
            displayedProjects?.filter((f) => f?.project_name?.replaceAll(' ', '').toLocaleLowerCase().includes(query.toLocaleLowerCase())).length > 0 ? (
              displayedProjects
                ?.filter((f) => f?.project_name?.replaceAll(' ', '').toLocaleLowerCase().includes(query.toLocaleLowerCase()))
                ?.map((element) => (
                  <div
                    className="single-member"
                    style={{ cursor: "pointer" }}
                    onClick={() => AddedProject(element?.project_name)}
                  >
                    <p>{element?.project_name}</p>
                    <BsPlus />
                  </div>
                ))
            ) : (
              <>
                <h5 className='not__Found__Header'>No project found matching {query}</h5>
                <div className='add__Anyway__Item' onClick={() => AddedProject(query)}>
                  <span>Add {query} anyway?</span>
                </div>
              </>
            )
          }
        </div>
        <button 
          disabled={btnDisabled} 
          className="add__Project__Btn" 
          onClick={postSettinguserproject}
        >
          {
            btnDisabled ? 
            <LoadingSpinner color={'#fff'} width={'1.1rem'} height={'1.1rem'} />
            :
            projectsAdded[0] ?
            "Update" :
             "Add Project"
          }
        </button>
      </div>
    </div>
  );
}