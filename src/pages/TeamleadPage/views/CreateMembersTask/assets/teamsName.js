import Front from './front.png'
import Back from './database.png'
import UXUI from './back.png'
export const teams = [
            {
                        name:"Front-end" , 
                        image:Front 
            },
            {
                        name:"Back-end" , 
                        image:Back 
            },
            {
                        name:"UI/UX" , 
                        image:UXUI
            }

]
export const imageReturn = (name) => {
            if ( name === "Front-end"){
                        return Front
            }
            if (name === "Back-end"){
                        return Back
            }
            if (name === "UI/UX"){
                        return UXUI
            }
            return null
}