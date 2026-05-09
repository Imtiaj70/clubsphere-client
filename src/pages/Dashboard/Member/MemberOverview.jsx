import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosInstance";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import { useAuth } from "../../../context/AuthContext";
import { FiLayers, FiCalendar, FiDollarSign } from "react-icons/fi";
import { Link } from "react-router-dom";

const MemberOverview = () => {
  const { user } = useAuth();

  const { data: memberships = [], isLoading: memLoading } = useQuery({
    queryKey: ["myMemberships"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/memberships/my");
      return res.data;
    },
  });

  const { data: registrations = [], isLoading: regLoading } = useQuery({
    queryKey: ["myRegistrations"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/registrations/my");
      return res.data;
    },
  });

  const { data: payments = [], isLoading: payLoading } = useQuery({
    queryKey: ["myPayments"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/memberships/my");
      return res.data.filter((m) => m.paymentId);
    },
  });

  if (memLoading || regLoading) return <LoadingSpinner fullScreen={false} />;

  const upcomingEvents = registrations.filter(
    (r) => r.event && new Date(r.event.eventDate) >= new Date() && r.status === "registered"
  );

  const stats = [
    { icon: <FiLayers size={22} />, label: "Clubs Joined", value: memberships.filter(m => m.status === "active").length, color: "bg-primary", to: "/dashboard/member/memberships" },
    { icon: <FiCalendar size={22} />, label: "Events Registered", value: registrations.filter(r => r.status === "registered").length, color: "bg-secondary", to: "/dashboard/member/events" },
    { icon: <FiDollarSign size={22} />, label: "Payments Made", value: payments.length, color: "bg-accent", to: "/dashboard/member/payments" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">
          Hey, {user?.displayName?.split(" ")[0]} 👋
        </h1>
        <p className="text-base-content/50 text-sm mt-1">Here's your activity overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="card bg-base-100 shadow border border-base-300 hover:shadow-lg transition-shadow">
            <div className="card-body p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/50 text-sm">{s.label}</p>
                  <p className="text-3xl font-bold font-heading mt-1">{s.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${s.color}`}>
                  {s.icon}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Upcoming events */}
      <div className="card bg-base-100 shadow border border-base-300">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-heading">Upcoming Events</h2>
            <Link to="/dashboard/member/events" className="text-primary text-sm hover:underline">
              View all
            </Link>
          </div>
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">📅</p>
              <p className="text-base-content/50 text-sm">No upcoming events</p>
              <Link to="/events" className="btn btn-primary btn-sm mt-3">Browse Events</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.slice(0, 4).map((reg) => (
                <div key={reg._id} className="flex items-center justify-between p-3 rounded-xl bg-base-200">
                  <div>
                    <p className="font-semibold text-sm">{reg.event?.title}</p>
                    <p className="text-xs text-base-content/50 mt-0.5">
                      {new Date(reg.event?.eventDate).toLocaleDateString()} · {reg.event?.location}
                    </p>
                  </div>
                  <span className="badge badge-success badge-sm">Registered</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active memberships */}
      <div className="card bg-base-100 shadow border border-base-300">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-heading">My Active Clubs</h2>
            <Link to="/dashboard/member/memberships" className="text-primary text-sm hover:underline">
              View all
            </Link>
          </div>
          {memberships.filter(m => m.status === "active").length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">🏛️</p>
              <p className="text-base-content/50 text-sm">You haven't joined any clubs yet</p>
              <Link to="/clubs" className="btn btn-primary btn-sm mt-3">Browse Clubs</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {memberships.filter(m => m.status === "active").slice(0, 4).map((m) => (
                <div key={m._id} className="flex items-center justify-between p-3 rounded-xl bg-base-200">
                  <div>
                    <p className="font-semibold text-sm">{m.club?.clubName}</p>
                    <p className="text-xs text-base-content/50">{m.club?.location} · {m.club?.category}</p>
                  </div>
                  <span className="badge badge-success badge-sm">Active</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberOverview;
