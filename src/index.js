import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

import { AlertProvider } from "./contexts/alert-context.tsx";
import { TeamProvider } from "./contexts/team-context.tsx";

import reportWebVitals from "./reportWebVitals";
import Homepage from "./pages/homepage";
import LoginRedirect from "./pages/login-redirect/index.tsx";
import Dashboard from "./pages/dashboard";
import Team from "./pages/team/index.tsx";
import LogoutRedirect from "./pages/logout-redirect/index.tsx";
import UserProfile from "./pages/profile/index.tsx";
import AuthGuard from "./guards/auth.guard.tsx";
import Logout from "./pages/dashboard/logout/index.jsx";
import AcceptInvite from "./pages/accept-invite/index.tsx";
import TeamLayout from "./pages/team-layout.tsx/index.tsx";
import AddNewTeam from "./pages/teams/add-new-team.tsx";
import StaffLayout from "./pages/staff-layout.tsx/index.tsx";

import "./index.css";
import MitreAttackListPage from "./pages/ctibutler/mitre-attacks/index.tsx";
import AttackDetailPage from "./pages/ctibutler/attack-details/index.tsx";

const AUTH0_DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN
const AUTH0_CLIENT_ID = process.env.REACT_APP_AUTH0_CLIENT_ID

const router = createBrowserRouter([
  {
    path: "/",
    Component: Homepage,
  },
  {
    path: "/login-redirect",
    Component: LoginRedirect,
  },
  {
    path: "/logout",
    Component: Logout,
  },
  {
    path: "/logout-redirect",
    Component: LogoutRedirect,
  },
  {
    path: "/login",
    Component: LogoutRedirect,
  },
  {
    path: "/home",
    Component: Dashboard,
  },
  {
    path: "",
    element: <AuthGuard>
      <Dashboard></Dashboard>
    </AuthGuard>,
    children: [
      {
        path: "user/account",
        Component: UserProfile,
      },
      {
        path: "",
        Component: TeamLayout,
        children: [
          {
            path: "teams/:teamId",
            Component: Team,
          },
        ],
      },
      {
        path: "staff",
        component: StaffLayout,
        children: [
        ]
      },
      {
        path: "attacks",
        Component: MitreAttackListPage,
      },
      {
        path: "attacks/:attack_type/:id",
        Component: AttackDetailPage,
      },
    ]
  },
  {
    path: "teams/invitation/:invite_id",
    Component: AcceptInvite,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <Auth0Provider
    domain={AUTH0_DOMAIN}
    clientId={AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: window.location.origin + "/login-redirect",
    }}
  >
    <AlertProvider>
      <TeamProvider>
        <RouterProvider router={router} />
      </TeamProvider>
    </AlertProvider>
  </Auth0Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
