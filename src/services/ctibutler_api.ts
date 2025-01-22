import axios from "axios";
import { apiRequest } from "./api.ts"

const CTIBUTLER_API_BASE_URL = `ctibutler_api/proxy/open`

export const fetchAttackEnterprises = (filters: any, page: number, sort: string) => {
    return apiRequest<any>(
        "GET",
        `/${CTIBUTLER_API_BASE_URL}/attack-enterprise/objects/`,
        {}, {},
        {
            ...filters,
            page: page + 1,
            sort,
        },
    )
}

const fetchAttackBundleByPage = (id: string, page: number) => {
    return apiRequest<any>(
        "GET",
        `/${CTIBUTLER_API_BASE_URL}/attack-enterprise/objects/${id}/bundle/`, {}, {},
        {
            page,
        }
    )
}

export const fetchAttackBundle = async (id: string) => {
    let hasMore = true
    let page = 1
    let results: [] = []
    while (hasMore) {
        const res = await fetchAttackBundleByPage(id, page)
        const objects: [] = res.data.objects
        if (objects.length < 50) {
            hasMore = false
        }
        page += 1
        results = [...results, ...objects]
    }
    return results
}
