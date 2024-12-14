export const getDateString = (date: string | undefined) => {
    if (!date) return '-'
    return new Date(date).toLocaleString()
}

export const cleanData = (data: object) => {
    const result: Object = {}
    Object.keys(data).forEach(key => {
        if (data[key] !== "") {
            result[key] = data[key]
        }
    })
    return result
}