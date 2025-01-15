import axios from "axios";
import { apiRequest } from "./api.ts"

const VULMATCH_API_BASE_URL = `vulmatch_api/proxy/open`

export const fetchCves = (filters: any, page: number, sort: string) => {
    return apiRequest(
        "GET",
        `/${VULMATCH_API_BASE_URL}/cve/objects/`,
        {}, {},
        {
            ...filters,
            page: page + 1,
            sort,
        },
    )
}

const fetchCveBundleByPage = (id: string, page: number) => {
    return apiRequest(
        "GET",
        `/${VULMATCH_API_BASE_URL}/cve/objects/${id}/bundle/`, {}, {},
        {
            page,
        }
    )
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

export const fetchCpes = (filters: any, page: number) => {
    return apiRequest(
        "GET",
        `/${VULMATCH_API_BASE_URL}/cpe/objects/`, {}, {},
        {
            ...filters,
            page: page + 1,
        },
    )
}
