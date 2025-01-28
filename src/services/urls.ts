export const URLS = {
    profile: () => '/user/account',
    mitreAttacks: (attack_type: string) => `/knowledgebases/${attack_type}`,
    attackDetailPage: (attack_type: string, id: string) => `/knowledgebases/${attack_type}/${id}`,

    teamManagement: (team_id) => `/teams/${team_id}`,
}
