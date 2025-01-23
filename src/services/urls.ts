export const URLS = {
    profile: () => '/user/account',
    mitreAttacks: (attack_type: string) => `/attacks?attack_type=${attack_type}`,
    attackDetailPage: (attack_type: string, id: string) => `/attacks/${attack_type}/${id}`,

    teamManagement: (team_id) => `/teams/${team_id}`,
}
