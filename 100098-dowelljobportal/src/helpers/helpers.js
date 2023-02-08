export const validateUrl = (url, withPath) => {
    try {

        let testUrl = new URL(url);

        if (withPath){

            if (testUrl.pathname.length > 1) return true;

            return false;
        }
        
        return true;

    }catch (err) {

        return false;
        
    }   
}

export const validateEmail = (email) => {

    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
    
}

export const getDeviceName = () => {
    let userAgent = navigator.userAgent;

    if (userAgent.match(/Windows/i)) return "Windows";

    if (userAgent.match(/Android/i)) return "Android";

    if (userAgent.match(/iPhone/i)) return "iPhone";

    if (userAgent.match(/iPad/i)) return "iPad";

    return "";
}

export const getDeviceLocation = () => {

}

export const getDeviceBrowser = () => {
    let userAgent = navigator.userAgent;
}

export const getDaysDifferenceFromPresentDate = (date) => {

    if ( new Date(date) == "Invalid Date" ) return 0;

    const today = new Date();

    const differenceInMilliSec = Math.abs(today - new Date(date));
    const differenceInDays = differenceInMilliSec / (1000 * 60 * 60 * 24);

    return Math.round(differenceInDays);

}

export const formatDateAndTime = (date) => {
    if ( new Date(date) == "Invalid Date" ) return "1st January";

    const daysEndingWithSt = [1, 21, 31];
    const daysEndingWithNd = [2, 22];
    const daysEndingWithRd = [3, 23];

    const day = new Date(date).toLocaleDateString("en-us", {day: "numeric"})
    const dayAsNumber = Number(day);
    const month = new Date(date).toLocaleDateString("en-us", {month: "long"})

    if ( daysEndingWithSt.includes(dayAsNumber) ) return `${day}st ${month}`;
    
    if ( daysEndingWithNd.includes(dayAsNumber) ) return `${day}nd ${month}`;

    if ( daysEndingWithRd.includes(dayAsNumber) ) return `${day}rd ${month}`;

    return `${day}th ${month}`;

}

export const changeToTitleCase = (testStr) => {

    if ( typeof (testStr) !== "string") return testStr;

    return testStr[0].toLocaleUpperCase() + testStr.slice(1).toLocaleLowerCase();

}

export const getDaysInMonth = (date) => {
    const validDateFormat = new Date(date);

    if ( validDateFormat == "Invalid Date" ) return 0;

    return new Date(validDateFormat.getFullYear(), validDateFormat.getMonth() + 1, 0).getDate();
}
