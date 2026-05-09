import { createBrowserRouter } from "react-router-dom";

// Layouts
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Public pages
import Home from "../pages/Home/Home";
import Clubs from "../pages/Clubs/Clubs";
import ClubDetail from "../pages/Clubs/ClubDetail";
import Events from "../pages/Events/Events";
import EventDetail from "../pages/Events/EventDetail";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import NotFound from "../pages/NotFound";

// Dashboard - Admin
import AdminOverview from "../pages/Dashboard/Admin/AdminOverview";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import ManageClubs from "../pages/Dashboard/Admin/ManageClubs";
import AdminPayments from "../pages/Dashboard/Admin/AdminPayments";

// Dashboard - Manager
import ManagerOverview from "../pages/Dashboard/Manager/ManagerOverview";
import MyClubs from "../pages/Dashboard/Manager/MyClubs";
import ClubMembers from "../pages/Dashboard/Manager/ClubMembers";
import ManageEvents from "../pages/Dashboard/Manager/ManageEvents";
import EventRegistrations from "../pages/Dashboard/Manager/EventRegistrations";

// Dashboard - Member
import MemberOverview from "../pages/Dashboard/Member/MemberOverview";
import MyMemberships from "../pages/Dashboard/Member/MyMemberships";
import MyEvents from "../pages/Dashboard/Member/MyEvents";
import PaymentHistory from "../pages/Dashboard/Member/PaymentHistory";

// Route guards
import { PrivateRoute, AdminRoute, ManagerRoute } from "./ProtectedRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "clubs", element: <Clubs /> },
      { path: "clubs/:id", element: <ClubDetail /> },
      { path: "events", element: <Events /> },
      { path: "events/:id", element: <EventDetail /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // Admin routes
      {
        path: "admin",
        element: <AdminRoute><AdminOverview /></AdminRoute>,
      },
      {
        path: "admin/users",
        element: <AdminRoute><ManageUsers /></AdminRoute>,
      },
      {
        path: "admin/clubs",
        element: <AdminRoute><ManageClubs /></AdminRoute>,
      },
      {
        path: "admin/payments",
        element: <AdminRoute><AdminPayments /></AdminRoute>,
      },
      // Manager routes
      {
        path: "manager",
        element: <ManagerRoute><ManagerOverview /></ManagerRoute>,
      },
      {
        path: "manager/clubs",
        element: <ManagerRoute><MyClubs /></ManagerRoute>,
      },
      {
        path: "manager/members/:clubId",
        element: <ManagerRoute><ClubMembers /></ManagerRoute>,
      },
      {
        path: "manager/events",
        element: <ManagerRoute><ManageEvents /></ManagerRoute>,
      },
      {
        path: "manager/registrations/:eventId",
        element: <ManagerRoute><EventRegistrations /></ManagerRoute>,
      },
      // Member routes
      {
        path: "member",
        element: <PrivateRoute><MemberOverview /></PrivateRoute>,
      },
      {
        path: "member/memberships",
        element: <PrivateRoute><MyMemberships /></PrivateRoute>,
      },
      {
        path: "member/events",
        element: <PrivateRoute><MyEvents /></PrivateRoute>,
      },
      {
        path: "member/payments",
        element: <PrivateRoute><PaymentHistory /></PrivateRoute>,
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default router;
