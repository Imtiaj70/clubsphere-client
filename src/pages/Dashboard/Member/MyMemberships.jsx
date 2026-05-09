import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosInstance";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import { Link } from "react-router-dom";
import { FiMapPin, FiTag, FiCalendar } from "react-icons/fi";

const MyMemberships = () => {
  const { data: memberships = [], isLoading } = useQuery({
    queryKey: ["myMemberships"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/memberships/my");
      return res.data;
    },
  });

  if (isLoading) return <LoadingSpinner fullScreen={false} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">My Clubs</h1>
        <p className="text-base-content/50 text-sm mt-1">{memberships.length} memberships</p>
      </div>

      {memberships.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🏛️</p>
          <p className="text-xl font-semibold">No memberships yet</p>
          <p className="text-base-content/50 mt-2">Join a club to get started</p>
          <Link to="/clubs" className="btn btn-primary mt-4">Browse Clubs</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {memberships.map((m) => (
            <div key={m._id} className="card bg-base-100 shadow border border-base-300">
              <div className="card-body p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
                    {m.club?.clubName?.[0]}
                  </div>
                  <span className={`badge badge-sm ${m.status === "active" ? "badge-success" : "badge-error"}`}>
                    {m.status}
                  </span>
                </div>

                <h2 className="font-bold font-heading mt-3">{m.club?.clubName}</h2>

                <div className="space-y-1 mt-2 text-sm text-base-content/60">
                  <p className="flex items-center gap-1"><FiMapPin size={13} /> {m.club?.location}</p>
                  <p className="flex items-center gap-1"><FiTag size={13} /> {m.club?.category}</p>
                  <p className="flex items-center gap-1">
                    <FiCalendar size={13} /> Joined {new Date(m.joinedAt).toLocaleDateString()}
                  </p>
                  {m.expiresAt && (
                    <p className="text-xs text-base-content/40">
                      Expires: {new Date(m.expiresAt).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="card-actions mt-4">
                  <Link to={`/clubs/${m.clubId}`} className="btn btn-outline btn-primary btn-sm w-full">
                    View Club
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyMemberships;
