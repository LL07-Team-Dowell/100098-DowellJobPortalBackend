import { useState } from 'react'
import { useValues } from '../../context/Values';
import './index.scss';

const FirstForm = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const {data , setdata} = useValues() ;
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  }
  console.log({individual_task:data.individual_task,team_task:data.team_task})
  return (
    <div>
    <label htmlFor="option1">Individual Task:</label>
    <input type="radio" id="option1" name="options" value="option1"  onChange={()=> {setdata({...data ,individual_task:true ,team_task:false  });console.log("donner un nombre")}}  required/>

    <label htmlFor="option2">Team Task:</label>
    <input type="radio" id="option2" name="options" value="option2"  onChange={()=> {setdata({...data ,individual_task:false ,team_task:true  })}} required />

    <p>Selected option: {selectedOption}</p>
  </div>
  )
}

export default FirstForm