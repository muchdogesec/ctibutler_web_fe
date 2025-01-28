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

const VERSION_FIELD_CONVERSION = {
    "attack-enterprise": "attack_version",
    "attack-ics": "attack_version",
    "attack-mobile": "attack_version",
    "capec": "capec_version",
    "cwe": "cwe_version",
    "disarm": "disarm_version",
    "atlas": "atlas_version",
    "location": "Location"
}
const fetchAttackBundleByPage = (attack_type: string, id: string, page: number, version: string) => {
    return apiRequest<any>(
        "GET",
        `/${CTIBUTLER_API_BASE_URL}/${attack_type}/objects/${id}/bundle/`, {}, {},
        {
            [VERSION_FIELD_CONVERSION[attack_type]]: version,
            page,
        }
    )
}

export const fetchAttackBundle = async (attack_type: string, id: string, version: string) => {
    let hasMore = true
    let page = 1
    let results: [] = []
    while (hasMore) {
        const res = await fetchAttackBundleByPage(attack_type, id, page, version)
        const objects: [] = res.data.objects
        if (objects.length < 50) {
            hasMore = false
        }
        page += 1
        results = [...results, ...objects]
    }
    return results
}

export const fetchKnowledgebaseVersions = async (attack_type: string, id: string) => {
    return apiRequest<any>(
        "GET",
        `/${CTIBUTLER_API_BASE_URL}/${attack_type}/objects/${id}/versions/`, {}, {},
    )
}

export const fetchAttackObject =  (attack_type: string, id: string, version: string) => {
    return apiRequest<any>(
        "GET",
        `/${CTIBUTLER_API_BASE_URL}/${attack_type}/objects/${id}/`, {}, {},
        {
            [VERSION_FIELD_CONVERSION[attack_type]]: version,
        }
    )
}
