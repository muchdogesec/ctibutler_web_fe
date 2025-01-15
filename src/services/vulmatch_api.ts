import axios from "axios";


export const fetchCves = (filters: Object, page: number, sort: string) => {
    return axios.get('http://37.27.208.239:8005/api/v1/cve/objects/', {
        headers: {
            'Accept': 'application/json'
        },
        params: {
            ...filters,
            page: page + 1,
            sort,
        },
    })
}

const fetchCveBundleByPage = (id: string, page: number) => {
    return axios.get(`http://37.27.208.239:8005/api/v1/cve/objects/${id}/bundle/`, {
        headers: {
            'Accept': 'application/json'
        },
        params: {
            page,
        }
    })
}

export const fetchCveBundle = async (id: string) => {
    let hasMore = true
    let page = 1
    let results: [] = []
    while (hasMore) {
        const res = await fetchCveBundleByPage(id, page)
        const objects: [] = res.data.objects
        if (objects.length < 50) {
            hasMore = false
        }
        page += 1
        results = [...results, ...objects]
    }
    return results
}

export const fetchCpes = (filters: Object, page: number) => {
    return axios.get('http://37.27.208.239:8005/api/v1/cpe/objects/', {
        headers: {
            'Accept': 'application/json'
        },
        params: {
            ...filters,
            page: page + 1,
        },
    })
}
