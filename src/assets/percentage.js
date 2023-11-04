export const percentage = (total, number) => {
    console.log({ total, number })
    return Number(((number / (total === 0 ? 1 : total)) * 100).toFixed(2));
}