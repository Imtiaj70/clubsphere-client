import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiHome, FiUsers, FiLayers, FiDollarSign,
  FiCalendar, FiList, FiUser, FiLogOut,
  FiMenu, FiX, FiBarChart2,
} from "react-icons/fi";
import toast from "react-hot-toast";

const adminLinks = [
  { to: "/dashboard/admin", label: "Overview", icon: <FiBarChart2 /> },
  { to: "/dashboard/admin/users", label: "Manage Users", icon: <FiUsers /> },
  { to: "/dashboard/admin/clubs", label: "Manage Clubs", icon: <FiLayers /> },
  { to: "/dashboard/admin/payments", label: "Payments", icon: <FiDollarSign /> },
];

const managerLinks = [
  { to: "/dashboard/manager", label: "Overview", icon: <FiBarChart2 /> },
  { to: "/dashboard/manager/clubs", label: "My Clubs", icon: <FiLayers /> },
  { to: "/dashboard/manager/events", label: "Events", icon: <FiCalendar /> },
];

const memberLinks = [
  { to: "/dashboard/member", label: "Overview", icon: <FiHome /> },
  { to: "/dashboard/member/memberships", label: "My Clubs", icon: <FiList /> },
  { to: "/dashboard/member/events", label: "My Events", icon: <FiCalendar /> },
  { to: "/dashboard/member/payments", label: "Payments", icon: <FiDollarSign /> },
];

const DashboardLayout = () => {
  const { user, dbUser, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = dbUser?.role;
  const links =
    role === "admin" ? adminLinks :
    role === "clubManager" ? managerLinks :
    memberLinks;

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/");
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-neutral text-white w-64">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold font-heading text-white">
          Club<span className="text-secondary">Sphere</span>
        </h1>
        <p className="text-white/50 text-xs mt-1 capitalize">{role} Panel</p>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <img
          src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=6C63FF&color=fff`}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover ring-2 ring-primary"
        />
        <div className="overflow-hidden">
          <p className="text-sm font-semibold truncate">{user?.displayName}</p>
          <p className="text-xs text-white/50 truncate">{user?.email}</p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all
              ${isActive
                ? "bg-primary text-white font-semibold"
                : "text-white/70 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <span className="text-lg">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Public site + logout */}
      <div className="p-4 border-t border-white/10 space-y-1">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-all"
        >
          <FiHome /> Back to Site
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/70 hover:bg-red-500/20 hover:text-red-400 transition-all"
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-base-200">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="flex-shrink-0">
            <Sidebar />
          </div>
          <div
            className="flex-1 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between lg:hidden">
          <h1 className="text-xl font-bold font-heading text-neutral">
            Club<span className="text-primary">Sphere</span>
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn btn-ghost btn-sm"
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
