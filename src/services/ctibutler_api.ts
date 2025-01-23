import axios from "axios";
import { apiRequest } from "./api.ts"

const CTIBUTLER_API_BASE_URL = `ctibutler_api/proxy/open`

export const fetchAttackEnterprises = (attack_type: string, filters: any, page: number, sort: string) => {
    return apiRequest<any>(
        "GET",
        `/${CTIBUTLER_API_BASE_URL}/${attack_type}/objects/`,
        {}, {},
        {
            ...filters,
            page: page + 1,
            sort,
        },
    )
}

const fetchAttackBundleByPage = (attack_type: string, id: string, page: number) => {
    return apiRequest<any>(
        "GET",
        `/${CTIBUTLER_API_BASE_URL}/${attack_type}/objects/${id}/bundle/`, {}, {},
        {
            page,
        }
    )
}

export const fetchAttackBundle = async (attack_type: string, id: string) => {
    let hasMore = true
    let page = 1
    let results: [] = []
    while (hasMore) {
        const res = await fetchAttackBundleByPage(attack_type, id, page)
        const objects: [] = res.data.objects
        if (objects.length < 50) {
            hasMore = false
        }
        page += 1
        results = [...results, ...objects]
    }
    return results
}

export const fetchAttackObject =  (attack_type: string, id: string) => {
    return apiRequest<any>(
        "GET",
        `/${CTIBUTLER_API_BASE_URL}/${attack_type}/objects/${id}/`, {}, {},
        {}
    )
}
