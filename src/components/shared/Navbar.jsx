import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { FiChevronDown } from "react-icons/fi";

const Navbar = () => {
  const { user, dbUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const dashboardPath =
    dbUser?.role === "admin" ? "/dashboard/admin" :
    dbUser?.role === "clubManager" ? "/dashboard/manager" :
    "/dashboard/member";

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/clubs", label: "Clubs" },
    { to: "/events", label: "Events" },
  ];

  return (
    <nav className="bg-neutral shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold font-heading text-white">
            Club<span className="text-secondary">Sphere</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? "text-secondary" : "text-white/80 hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Auth section */}
          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm text-white">
                  Login
                </Link>
                <Link to="/register" className="btn btn-secondary btn-sm">
                  Register
                </Link>
              </>
            ) : (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="flex items-center gap-2 cursor-pointer">
                  <img
                    src={
                      user.photoURL ||
                      `https://ui-avatars.com/api/?name=${user.displayName}&background=6C63FF&color=fff`
                    }
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-secondary"
                  />
                  <FiChevronDown className="text-white/70 hidden md:block" />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow-xl bg-base-100 rounded-xl w-52 mt-2 border border-base-300"
                >
                  <li className="px-3 py-2 border-b border-base-300 mb-1">
                    <div>
                      <p className="font-semibold text-sm truncate">{user.displayName}</p>
                      <p className="text-xs text-base-content/50 capitalize">{dbUser?.role}</p>
                    </div>
                  </li>
                  <li>
                    <Link to={dashboardPath} className="text-sm">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="text-sm text-error">
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}

            {/* Mobile menu toggle */}
            <div className="md:hidden dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-sm text-white">
                ☰
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow-xl bg-base-100 rounded-xl w-44 mt-2"
              >
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink to={link.to} end className="text-sm">
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
