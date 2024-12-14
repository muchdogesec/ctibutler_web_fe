export function setAuthToken(token: string) {
  window.localStorage.setItem("token", token);
}
export function getAuthToken() {
  return window.localStorage.getItem("token");
}
export function setApiKey(api_key: string) {
  window.localStorage.setItem("api_key", api_key);
}
export function getApiKey() {
  return window.localStorage.getItem("api_key");
}

export function setUserData(user_data: any) {
  window.localStorage.setItem("user_data", JSON.stringify(user_data));
}

export function getUserData() {
  const result = window.localStorage.getItem("user_data");
  if (result) return JSON.parse(result);
  return null;
}

export function setActiveTeamId(team_id: string) {
  window.localStorage.setItem("active_team_id", String(team_id));
}

export function getActiveTeamId() {
  const result = window.localStorage.getItem("active_team_id");
  return result ? result : null;
}

export function clearAuthData() {
  window.localStorage.clear();
}

export function setInvitationId(id: string) {
  window.sessionStorage.setItem('invitation', JSON.stringify({id, time: Number(new Date())}))
}

export function getInvitationId() {
  const invitation = window.sessionStorage.getItem('invitation')
  window.sessionStorage.removeItem('invitation')
  if (!invitation) return null
  const invitationJson = JSON.parse(invitation)
  if(invitationJson.time - Number(new Date()) > 5 * 60 * 60 * 1000) {
    return null
  }
  return invitationJson.id
}