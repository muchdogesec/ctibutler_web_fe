import { Subscription } from "./api";

export interface ITeam {
    id: string;
    name: string;
    description: string;
    is_admin: string;
    is_owner: string;
    is_private: string;
    owner_id: number;
    allowed_api_access: boolean;
    allowed_data_download: boolean;
    subscription: Subscription;
    has_active_subscription: boolean;
    feed_count: number;
    feed_limit: number;
    user_limit: number;
    members_count: number;
    api_keys_count: number;
    invitations_count: number;
}

export interface ITeamWithLimit extends ITeam {
    limits_exceeded: boolean;
    feed_limit: number;
}

export interface AdminTeam extends ITeam {
    user_emails: string[];
    members_count: number,
    invitations_count: number,
    feed_count: number,
    feed_limit: number,
    user_limit: number,
}

export interface IInvitation {
    id: number;
    email: string;
    role: string;
    team: {
        id: string;
        name: string;
        description: string;
    }
}

export interface Member {
    id: number;
    user_id: string;
    display_name: string;
    role: string;
    email: string;
}