import axios from 'axios';
import { getApiKey } from './storage.ts';
import { AdminTeam, IInvitation, ITeamWithLimit } from './types.ts';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api'
const API_AUTH_URL = process.env.REACT_APP_API_AUTH_URL || '/api/rest-auth/auth0/'

type Paginated<T> = {
    results: T;
    count: number;
}

// Common function for API requests with Authorization headers
const apiRequest = async <T>(
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
    path: string,
    data?: any,
    headers: Record<string, string> = {},
    params: Record<string, string | number> = {},
) => {
    try {
        const response = await axios<T>({
            method,
            url: `${API_BASE_URL}${path}`,
            data,
            headers: {
                Authorization: `Token ${getApiKey()}`,
                ...headers,
            },
            params,
        });
        return response;
    } catch (error) {
        if(error?.response?.status === 401) {
            window.location.href = '/logout-redirect'
        }
        throw error;
    }
};

// Authentication API
const authApi = async (accessToken: string): Promise<string> => {
    const response = await fetch(API_AUTH_URL, {
        method: "POST",
        body: JSON.stringify({
            access_token: accessToken
        }),
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'omit'
    }).then(res => res.json())
    return response['key']
};

// API functions
const createTeam = async (name: string, description: string) => {
    return apiRequest<{ id: string }>('POST', '/teams/api/teams/', { name, description });
};

const deleteTeam = async (teamId: string) => {
    await apiRequest<{ id: string }>('DELETE', `/teams/api/teams/${teamId}/`);
};

const changeUserEmail = async (email: string) => {
    return apiRequest<void>('PATCH', '/users/user-management/change-email/', { email });
};

const resendVerificationEmail = async () => {
    return apiRequest<void>('POST', '/users/user-management/resend-my-verification-email/', {});
};

const changeUserPassword = async () => {
    return apiRequest<void>('POST', '/users/user-management/change-password/');
};

const disableOTP = async () => {
    return apiRequest<void>('POST', '/users/user-management/disable-otp/');
};

const initializeOTP = async () => {
    return apiRequest<any>('POST', '/users/user-management/init-otp/');
};

const verifyOTP = async (otp: string, otpKey: string) => {
    return apiRequest<void>('POST', '/users/user-management/verify-otp/', { otp, otp_key: otpKey });
};

const cancelInvite = async (invitationId: number) => {
    return apiRequest<void>('POST', `/teams/api/user/invitations/${invitationId}/cancel-invitation/`);
};

const acceptInvite = async (invitationId: number) => {
    return apiRequest<void>('POST', `/teams/api/user/invitations/${invitationId}/accept-invitation/`);
};

const completeRegistration = async (data: {}) => {
    return apiRequest<void>('POST', `/teams/api/user/complete-registration/`, data);
};

const updateTeam = async (teamId: string, teamData: { name: string; description: string }) => {
    return apiRequest<void>('PUT', `/teams/api/teams/${teamId}/`, teamData);
};

const adminUpdateTeam = async (teamId: string, teamData: { name: string; description: string }) => {
    return apiRequest<void>('PUT', `/teams/api/admin/${teamId}/`, teamData);
};

const adminFetchTeams = async (page: number, search: string) => {
    return apiRequest<Paginated<AdminTeam[]>>('GET', '/teams/api/admin/', {}, {}, { page: page + 1, search });
}

const fetchTeams = async (page: number, search: string) => {
    return apiRequest<Paginated<any[]>>('GET', '/teams/api/teams/', {}, {}, { page: page + 1, search });
};

const fetchTeam = async (id: string) => {
    return apiRequest<any>('GET', `/teams/api/teams/${id}/`);
};

const fetchTeamLimits = async (id: string) => {
    return apiRequest<ITeamWithLimit>('GET', `/teams/api/teams/${id}/limits/`);
};

const leaveTeam = async (id: string) => {
    return apiRequest<any>('POST', `/teams/api/teams/${id}/leave-team/`);
};

const removeTeamMember = async (id: string, user_id: string) => {
    return apiRequest<any>('POST', `/teams/api/teams/${id}/remove-member/`, {
        user_id
    });
};

const changeTeamMemberRole = async (id: string, user_id: string, role: string) => {
    return apiRequest<any>('POST', `/teams/api/teams/${id}/change-role/`, {
        user_id, role
    });
};

const fetchApiKeys = async () => {
    return apiRequest<any>('GET', `/teams/api/user/api-keys/`);
};

const deleteApiKeys = async (id: string) => {
    return apiRequest<any>('DELETE', `/teams/api/user/api-keys/${id}/`);
};

const createApiKey = async (teamId: string, data) => {
    return apiRequest<any>('POST', `/teams/api/teams/${teamId}/api-keys/`, data);
};



const fetchMyInvitations = async () => {
    return apiRequest<Paginated<any[]>>('GET', '/teams/api/user/invitations/').then(response => {
        return response.data.results
    });
};

const getMembers = async (teamId: string) => {
    return apiRequest<any>('GET', `/teams/api/teams/${teamId}/members/`);
};

const getInvitedMembers = async (teamId: string) => {
    return apiRequest<Paginated<any[]>>('GET', `/teams/api/teams/${teamId}/invitations/?is_accepted=false`);
};

const inviteUser = async (teamId: string, email: string, isAdmin: boolean) => {
    return apiRequest<void>('POST', `/teams/api/teams/${teamId}/invitations/`, { email, role: isAdmin ? 'admin' : 'member' });
};

const bulkInviteUser = async (teamId: string, data: { email: string, role: string }[]) => {
    return apiRequest<void>('POST', `/teams/api/teams/${teamId}/invitations/bulk-create/`, data);
};

const cancelMembership = async (teamId: string) => {
    return apiRequest<void>('POST', `/teams/api/teams/${teamId}/cancel/`);
};

const cancelInvitation = async (teamId: string, invitationId: number) => {
    return apiRequest<void>('DELETE', `/teams/api/teams/${teamId}/invitations/${invitationId}/`);
};

type Price = {
    id: string;
    product_name: string;
    human_readable_price: string;
    payment_amount: string;
    nickname: string;
    unit_amount: number;
    recurring_type: string
};

export type Product = {
    djstripe_id: number;
    prices: Price[];
    djstripe_created: string; // ISO 8601 date string
    djstripe_updated: string; // ISO 8601 date string
    id: string;
    livemode: boolean;
    created: string; // ISO 8601 date string
    metadata: Record<string, any>;
    description: string;
    name: string;
    type: string;
    active: boolean;
    attributes: any[];
    caption: string;
    deactivate_on: any[] | null;
    images: string[];
    package_dimensions: any | null;
    shippable: boolean | null;
    url: string;
    statement_descriptor: string;
    unit_label: string;
    djstripe_owner_account: string;
    default_price: string;
};


const fetchSubscriptionPlans = async () => {
    return apiRequest<Paginated<Product[]>>('GET', `/subscriptions/api/plans/`);
}


const changeSubscriptionPlan = async (teamId: string, priceId: string) => {
    return apiRequest<{ redirect_url: string }>('POST', `/team-management/${teamId}/subscription/subscription/init/`, {
        price_id: priceId
    });
};

const confirmChangeSubscriptionPlan = async (teamId: string, sessionId: string) => {
    return apiRequest<{ redirect_url: string }>('POST', `/team-management/${teamId}/subscription/subscription/init/confirm-subscription/`, {
        session_id: sessionId
    });
};


const initSubscriptionManagementPortal = async (teamId: string) => {
    return apiRequest<{ redirect_url: string }>('POST', `/team-management/${teamId}/subscription/subscription/init/create-portal-session/`, {
    });
};


interface SubscriptionItem {
    id: string;
    price: Price;
    quantity: number;
}

export interface Subscription {
    id: string;
    start_date: string; // ISO date string
    current_period_start: string; // ISO date string
    current_period_end: string; // ISO date string
    cancel_at_period_end: boolean;
    status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid'; // Based on Stripe statuses
    quantity: number;
    items: SubscriptionItem[];
}


const getTeamActiveSubscription = (teamId: string) => {
    return apiRequest<Subscription>('GET', `/team-management/${teamId}/subscription/subscription/init/active-subscription/`)
}

const fetchTeamProfiles = (teamId: string) => {
    return apiRequest<any>('GET', `/teams/api/teams/${teamId}/profiles/`)
}

const registerTeamProfile = (teamId: string, profile_id: string) => {
    return apiRequest<Subscription>('POST', `/teams/api/teams/${teamId}/add-profile/`, { profile_id })
}

const deleteTeamProfile = (teamId: string, profile_id: string) => {
    return apiRequest<Subscription>('POST', `/teams/api/teams/${teamId}/remove-profile/`, { profile_id })
}

const loadInvitation = (inviteId: string) => {
    return apiRequest<IInvitation>('GET', `/teams/api/user/invitations/${inviteId}/`)
}

export interface IUser {
    id: string;
    last_login: string;
    is_superuser: boolean;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    is_staff: boolean;
    is_active: boolean;
    date_joined: string;
    avatar: string | null;
    groups: any[];
    user_permissions: any[];
    teams: {
        id: string;
        name: string;
        owner_id: string;
    }[];
}

interface PaginatedResponse<T> {
    count: number;
    results: T[]
}

const adminFetchUsers = (
    filter: {
        page: number,
        search: string,
        sort_by: string,
        order: 'asc' | 'desc'
    }
) => {
    return apiRequest<PaginatedResponse<IUser>>('GET', `/users/admin-user-management/`, {}, {}, {
        page: filter.page, search: filter.search, ordering: filter.order === 'asc' ? filter.sort_by : `-${filter.sort_by}`
    })
}


const makeAdmin = (userId: string) => {
    return apiRequest('POST', `/users/admin-user-management/${userId}/make-staff/`)
}

const removeAdmin = (userId: string) => {
    return apiRequest('POST', `/users/admin-user-management/${userId}/remove-staff/`)
}


export const Api = {
    apiRequest,
    createTeam,
    deleteTeam,
    changeUserEmail,
    changeUserPassword,
    resendVerificationEmail,
    disableOTP,
    initializeOTP,
    verifyOTP,
    updateTeam,
    adminFetchTeams,
    adminUpdateTeam,
    fetchTeams,
    fetchTeam,
    fetchTeamLimits,
    leaveTeam,
    removeTeamMember,
    changeTeamMemberRole,
    fetchMyInvitations,
    cancelInvite,
    acceptInvite,
    loadInvitation,
    completeRegistration,
    getMembers,
    getInvitedMembers,
    inviteUser,
    cancelMembership,
    cancelInvitation,
    authApi,
    changeSubscriptionPlan,
    fetchSubscriptionPlans,
    confirmChangeSubscriptionPlan,
    getTeamActiveSubscription,
    initSubscriptionManagementPortal,
    fetchTeamProfiles,
    registerTeamProfile,
    deleteTeamProfile,
    adminFetchUsers,
    makeAdmin,
    removeAdmin,
    deleteApiKeys,
    fetchApiKeys,
    createApiKey,
    bulkInviteUser,
};
