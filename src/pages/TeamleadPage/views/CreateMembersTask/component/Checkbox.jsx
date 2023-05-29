import React, { useEffect, useState } from 'react'
import { useValues } from '../context/Values';

const Checkbox = ({choosedTeamValue , Member }) => {
            const {data , setdata} = useValues()
            const [checked , setchecked] = useState(false);
            const [member ,setmeber] = useState(Member) ;
            const [changed , setchanged] = useState(false)
            console.log("member",member)
            useEffect(()=>{
                        // console.log({memberEffect:data.membersEditTeam , member})
                        const members = data.TeamsSelected.find(v => v.team_name === choosedTeamValue).members
                        if (Array.isArray(member) && member.length === 1) {
                                    if(data.TeamsSelected.find(v => v.team_name === choosedTeamValue).members.map(v => v.name).find(v => v === member[0])){
                                                setchecked(true) ; 
                                    }
                        }
                        else{
                                    if(members.find(v => v === Member))
                                    {
                                                setchecked(true) ; 
                                                console.log("useEffect1 else")
                                    }
                        }
                  
            },[])
            useEffect(()=>{
                        if(changed){
                                    if (Array.isArray(member) && member.length === 1){
                                                console.log("useEffect2 if")
                                                if(checked === true){
                                                            setdata({...data , membersEditTeam:[...data.membersEditTeam ,member[0]]})
                                                            console.log(`added ${member[0]}`)
                                                }
                                                if(checked === false){
                                                            setdata({...data , membersEditTeam:data.membersEditTeam.filter(m => m != member[0])}) ;
                                                            console.log(`removed ${member[0]}`) ; 
                        
                                                } 
                                    }else{
                                                console.log("useEffect2 else")

                                                if(checked === true){
                                                            setdata({...data , membersEditTeam:[...data.membersEditTeam ,member]})
                                                            console.log(`added ${member}`)
                                                }
                                                if(checked === false){
                                                            setdata({...data , membersEditTeam:data.membersEditTeam.filter(m => m != member)}) ;
                                                            console.log(`removed ${member}`) ; 
                        
                                                }
                                    }
                                   
                        }
            },[checked])
            console.log({membersEditTeam:data.membersEditTeam})
  return (
            <label>
            <input
                                                checked={checked} 
                                                  type="checkbox"
                                                  value={member}
                                                  onChange={() => {
                                                            setchanged(true)
                                                            setchecked(!checked)
                                                  }}
                                                />
            {member}
          </label>
  )
}

export default Checkbox