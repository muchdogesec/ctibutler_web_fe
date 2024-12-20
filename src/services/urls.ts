export const URLS = {
    profile: () => '/user/account',

    staffUserList: () => '/staff/manage-users',
    staffUserListWithEmailQuery: (userEmail: string) => `/staff/manage-users?email=${userEmail}`,
    staffTeamList: () => '/staff/manage-teams',

    teamManagement: (team_id) => `/teams/${team_id}`,
}
