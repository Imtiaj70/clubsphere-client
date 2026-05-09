import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosInstance";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import { useAuth } from "../../../context/AuthContext";
import { FiLayers, FiUsers, FiCalendar, FiDollarSign } from "react-icons/fi";

const ManagerOverview = () => {
  const { user } = useAuth();

  const { data: clubs = [], isLoading: clubsLoading } = useQuery({
    queryKey: ["managerClubs"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/clubs/manager/my-clubs");
      return res.data;
    },
  });

  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["managerEvents"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/events/manager/my-events");
      return res.data;
    },
  });

  const totalMembers = clubs.reduce((sum, c) => sum + (c.memberCount || 0), 0);

  if (clubsLoading || eventsLoading) return <LoadingSpinner fullScreen={false} />;

  const stats = [
    { icon: <FiLayers size={22} />, label: "My Clubs", value: clubs.length, color: "bg-primary" },
    { icon: <FiUsers size={22} />, label: "Total Members", value: totalMembers, color: "bg-secondary" },
    { icon: <FiCalendar size={22} />, label: "Total Events", value: events.length, color: "bg-accent" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">
          Welcome, {user?.displayName?.split(" ")[0]} 👋
        </h1>
        <p className="text-base-content/50 text-sm mt-1">Here's your club manager overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card bg-base-100 shadow border border-base-300">
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
          </div>
        ))}
      </div>

      {/* My clubs quick view */}
      <div className="card bg-base-100 shadow border border-base-300">
        <div className="card-body">
          <h2 className="text-lg font-bold font-heading mb-4">My Clubs</h2>
          {clubs.length === 0 ? (
            <p className="text-base-content/40 text-sm">No clubs yet. Create your first club!</p>
          ) : (
            <div className="space-y-3">
              {clubs.map((club) => (
                <div key={club._id} className="flex items-center justify-between p-3 rounded-xl bg-base-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {club.clubName?.[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{club.clubName}</p>
                      <p className="text-xs text-base-content/50">{club.memberCount || 0} members</p>
                    </div>
                  </div>
                  <span className={`badge badge-sm ${
                    club.status === "approved" ? "badge-success" :
                    club.status === "pending" ? "badge-warning" : "badge-error"
                  }`}>
                    {club.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upcoming events quick view */}
      <div className="card bg-base-100 shadow border border-base-300">
        <div className="card-body">
          <h2 className="text-lg font-bold font-heading mb-4">Upcoming Events</h2>
          {events.length === 0 ? (
            <p className="text-base-content/40 text-sm">No events created yet.</p>
          ) : (
            <div className="space-y-3">
              {events.slice(0, 5).map((event) => (
                <div key={event._id} className="flex items-center justify-between p-3 rounded-xl bg-base-200">
                  <div>
                    <p className="font-semibold text-sm">{event.title}</p>
                    <p className="text-xs text-base-content/50">
                      {new Date(event.eventDate).toLocaleDateString()} · {event.location}
                    </p>
                  </div>
                  <span className={`badge badge-sm ${event.isPaid ? "badge-accent" : "badge-success"}`}>
                    {event.isPaid ? `$${event.eventFee}` : "Free"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerOverview;
