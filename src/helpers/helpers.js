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

export const formatDateAndTime = (date, includeYear=false) => {
    if ( new Date(date) == "Invalid Date" ) return "1st January";

    const daysEndingWithSt = [1, 21, 31];
    const daysEndingWithNd = [2, 22];
    const daysEndingWithRd = [3, 23];

    const day = new Date(date).toLocaleDateString("en-us", {day: "numeric"})
    const dayAsNumber = Number(day);
    const month = new Date(date).toLocaleDateString("en-us", {month: "long"})
    const year = new Date(date).getFullYear();

    if ( daysEndingWithSt.includes(dayAsNumber) ) return `${day}st ${month} ${includeYear ? year : ''}`;
    
    if ( daysEndingWithNd.includes(dayAsNumber) ) return `${day}nd ${month} ${includeYear ? year : ''}`;

    if ( daysEndingWithRd.includes(dayAsNumber) ) return `${day}rd ${month} ${includeYear ? year : ''}`;

    return `${day}th ${month} ${includeYear ? year : ''}`;

}

export const changeToTitleCase = (testStr) => {

    if ( typeof (testStr) !== "string") return testStr;

    return testStr[0]?.toLocaleUpperCase() + testStr?.slice(1).toLocaleLowerCase();

}

export const getDaysInMonth = (date) => {
    const validDateFormat = new Date(date);

    if ( validDateFormat == "Invalid Date" ) return 0;

    return new Date(validDateFormat.getFullYear(), validDateFormat.getMonth() + 1, 0).getDate();
}

export const formatDateForAPI = (date, type='normal') => {
    const dateInProperFormat = new Date(date);
    if (typeof dateInProperFormat == 'Invalid Date') {
        if (type === 'report') return '01/01/1970 0:00:00'
        return '01-01-1970'
    }

    const [ year, month, day ] = [
        dateInProperFormat.getFullYear(),
        dateInProperFormat.getMonth() + 1,
        dateInProperFormat.getDate(),
    ]

    if (type === 'day-only') {
        return `${
            day < 10 ? "0" + day : day
        }`
    }

    if (type === 'report') {
        return `${month}/${day < 10 ? "0" + day : day}/${year} 0:00:00`
    }

    return `${year}-${month < 10 ? "0" + month : month}-${
        day < 10 ? "0" + day : day
    }`
}

export const getDaysDifferenceBetweenDates = (startDate, endDate) => {
    if (
        new Date(startDate) == "Invalid Date" ||
        new Date(endDate) == "Invalid Date" ||
        (startDate > endDate)
    ) return 0

    const startDateFormatted = new Date(startDate);
    const endDateFormatted = new Date(endDate);

    const differenceInMilliSec = Math.abs(endDateFormatted - startDateFormatted);
    const differenceInDays = differenceInMilliSec / (1000 * 60 * 60 * 24);

    return Math.round(differenceInDays);
}