export const URLS = {
    profile: () => '/user/account',
    mitreAttacks: () => '/attacks',
    attackDetailPage: (id: string) => `/attacks/${id}`,

    teamManagement: (team_id) => `/teams/${team_id}`,
}
