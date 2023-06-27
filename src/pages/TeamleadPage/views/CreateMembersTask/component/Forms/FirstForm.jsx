import { useState } from 'react'
import { useValues } from '../../context/Values';
import './index.scss';

const FirstForm = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const {data , setdata} = useValues() ;
  const [selectedOption1,setSelectedOption1] = useState(false)
  const [selectedOption2,setSelectedOption2] = useState(false)
  
  const selectOption1 = () => {
    setdata({...data ,individual_task:true ,team_task:false  })
    setSelectedOption1(true)
    setSelectedOption2(false)
  }
  const selectOption2 = () => {
    setdata({...data ,individual_task:false ,team_task:true  })
    setSelectedOption2(true)
    setSelectedOption1(false)
  }
  return (
    <div>
    <label className="card-label" htmlFor="option1" style={selectedOption1 ? {backgroundColor:"green",color:"white"}:{}}>Individual Task:
    <input type="radio" id="option1" name="options" value="option1"   onChange={selectOption1}  required/></label>

    <label className="card-label" htmlFor="option2" style={selectedOption2 ? {backgroundColor:"green",color:"white"}:{}}>Team Task:
    <input type="radio" id="option2" name="options" value="option2"  onChange={selectOption2} required /></label>

    <p>Selected option: {selectedOption}</p>
  </div>
  )
}

export default FirstForm