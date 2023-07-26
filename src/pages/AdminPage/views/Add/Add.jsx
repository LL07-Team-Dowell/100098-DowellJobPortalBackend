import React, {useState,useEffect}from 'react'
import axios from 'axios'

import './Add.scss'
import StaffJobLandingLayout from '../../../../layouts/StaffJobLandingLayout/StaffJobLandingLayout'
import { MdArrowBackIos } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { useCurrentUserContext } from '../../../../contexts/CurrentUserContext'
import { FaTimes } from 'react-icons/fa'
import { BsPlus } from 'react-icons/bs'
import { toast } from 'react-toastify'
const Add = () => {
  
  const navigate = useNavigate() 
  const [showProjectsPop, setShowProjectsPop] = useState(false)
  const showProjectPopup = () => {
    setShowProjectsPop(true)
  }
  const unshowProjectPopup = () => {
    setShowProjectsPop(false)
  }
  return (
    <StaffJobLandingLayout
      adminView={true}
      adminAlternativePageActive={true}
      hideTitleBar={false}
      pageTitle={"Add Item"}
      showAnotherBtn={true}
      btnIcon={<MdArrowBackIos size="1.5rem" />}
      handleNavIcon={() => navigate(-1)}
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
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ex sunt eius in, consectetur laudantium a, obcaecati repudiandae 
              </p>
            </div>
          </div>
          <div style={{ marginTop: 30 }} className="Create_Team" onClick={showProjectPopup}  >
            <div>
              <div>
                <AiOutlinePlusCircle
                  className="icon"
                  style={{ fontSize: "2rem" }}
                />
              </div>
              <h4>Add Project</h4>
              <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ex sunt eius in, consectetur laudantium a, obcaecati repudiandae 
              </p>
            </div>
          </div>
          <div style={{ marginTop: 30 }} className="Create_Team" onClick={showProjectPopup}  >
            <div>
              <div>
                <AiOutlinePlusCircle
                  className="icon"
                  style={{ fontSize: "2rem" }}
                />
              </div>
              <h4>Add team</h4>
              <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ex sunt eius in, consectetur laudantium a, obcaecati repudiandae 
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
  const [inputProjects,setInputProjects] = useState([ ])
  const [displaidProjects, setDesplaidProjects] = useState(['alaProject1','ayoProject2','manishProject3',].map((project,index) => ({id:index ,project})))
  // functions
  const removeProject = (id) => {
    setInputProjects(inputProjects.filter(f => f.id !== id))
    setDesplaidProjects([...displaidProjects,inputProjects?.find(f => f.id === id)])
  }
  const AddedProject = (id) => {
    setInputProjects([...inputProjects,displaidProjects.find(f => f.id === id)])
    setDesplaidProjects(displaidProjects?.filter(f => f.id !== id))
  }
  const postSettinguserproject = () => {
    if(inputProjects.length > 0){
      const data = {
        company_id: currentUser?.portfolio_info[0].org_id,
        data_type: currentUser.portfolio_info[0].data_type,
        project_list: inputProjects
      }
      axios.post('https://100098.pythonanywhere.com/settinguserproject/',data)
        .then(resp => {
          console.log(resp)
          unshowProjectPopup()
          toast.success('Project Created Successfully ')
        })
        .catch(err => console.log(err))
    }else{
      toast.error('No Projects To Add')
    }
  }
  return <div className="overlay">
    <div className='Project_Popup'>
      <FaTimes fontSize={'small'} style={{display:'block',margin:'0 0 0 auto',cursor:'pointer'}} onClick={unshowProjectPopup}/>
       <h4 style={{marginBottom:15, color:'#005734'}}>Select Projects </h4>
            <div className='added-members-input'>
            { 
              inputProjects?.map(v => <div key={v.id} style={{cursor:'pointer'}} onClick={()=>removeProject(v.id)}><p>{v.project}</p><FaTimes fontSize={'small'}/></div>)
            }
            <input type="text"  placeholder='search member' value={query} onChange={e => setquery(e.target.value)}/>
          </div>
          <br />
          <label htmlFor='task_name'>Select Projects</label>
          <div className='members'>
        {displaidProjects
          ?.filter(f => f.project.includes(query)).length > 0 ?
          displaidProjects
          ?.filter(f => f.project.includes(query))
          ?.map((element) => (
          <div className="single-member" style={{cursor:'pointer'}} onClick={()=>AddedProject(element.id)} >
            <p>{element.project}</p>
            <BsPlus/>
          </div>
      )):
        <h3>No More Projects</h3>
      }
      </div>
      <button onClick={postSettinguserproject}>Add Project</button>
  </div>
  </div>
}