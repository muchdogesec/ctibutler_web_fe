export const URLS = {
    profile: () => '/user/account',

    staffUserList: () => '/staff/manage-users',
    staffUserListWithEmailQuery: (userEmail: string) => `/staff/manage-users?email=${userEmail}`,
    staffTeamList: () => '/staff/manage-teams',

    teamManagement: (team_id) => `/teams/${team_id}`,
    vulnerabilityDetailPage: (cve_id: string) => `/vulnerabilities/${cve_id}`,
    vulnerabilityListPageForCpe: (cpe_id: string) => `/vulnerabilities/?cpe_id=${cpe_id}`,
}
