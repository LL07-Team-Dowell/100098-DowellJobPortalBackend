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
            if ( name.toLowerCase() === "front-end"){
                        return Front
            }
            if (name.toLowerCase() === "back-end"){
                        return Back
            }
            if (name.toLowerCase() === "ui/ux"){
                        return UXUI
            }
            return null
}