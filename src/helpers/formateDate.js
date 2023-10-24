export default function formatDate(inputDate) {
    const dateParts = inputDate.split('-');
    if (dateParts.length === 3) {
        const year = dateParts[0];
        const month = dateParts[1];
        const day = dateParts[2];

        const formattedDate = `${month}/${day}/${year} 00:00:00`;
        return formattedDate;
    } else {
        return 'Invalid date format';
    }
}