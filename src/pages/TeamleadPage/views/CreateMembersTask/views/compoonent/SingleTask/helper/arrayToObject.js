export function arrayToObject(array) {
    const result = {};
    for (const item of array) {
        result[item.name] = item.value;
    }
    return result;
}

export function objectToArray(obj) {
    const array = [];
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            array.push({ name: key, value: obj[key] });
        }
    }
    return array;
}