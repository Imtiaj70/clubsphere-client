import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosInstance";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { FiUsers, FiLayers, FiDollarSign, FiCalendar, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";

const StatCard = ({ icon, label, value, color }) => (
  <div className="card bg-base-100 shadow border border-base-300">
    <div className="card-body p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base-content/50 text-sm">{label}</p>
          <p className="text-3xl font-bold font-heading mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  </div>
);

const AdminOverview = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/admin/stats");
      return res.data;
    },
  });

  const { data: chartData = [], isLoading: chartLoading } = useQuery({
    queryKey: ["adminChart"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/admin/chart-data");
      return res.data;
    },
  });

  if (statsLoading) return <LoadingSpinner fullScreen={false} />;

  const COLORS = ["#6C63FF", "#4ECDC4", "#FF6B6B", "#FBBD23", "#36D399", "#3ABFF8", "#F472B6", "#A78BFA"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">Admin Overview</h1>
        <p className="text-base-content/50 text-sm mt-1">Platform-wide statistics</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={<FiUsers size={22} />} label="Total Users" value={stats?.totalUsers} color="bg-primary" />
        <StatCard icon={<FiLayers size={22} />} label="Total Clubs" value={stats?.totalClubs} color="bg-secondary" />
        <StatCard icon={<FiCalendar size={22} />} label="Total Events" value={stats?.totalEvents} color="bg-accent" />
        <StatCard icon={<FiDollarSign size={22} />} label="Total Revenue" value={`$${stats?.totalRevenue?.toFixed(2) || 0}`} color="bg-success" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<FiClock size={22} />} label="Pending Clubs" value={stats?.pendingClubs} color="bg-warning" />
        <StatCard icon={<FiCheckCircle size={22} />} label="Approved Clubs" value={stats?.approvedClubs} color="bg-success" />
        <StatCard icon={<FiXCircle size={22} />} label="Rejected Clubs" value={stats?.rejectedClubs} color="bg-error" />
      </div>

      {/* Chart */}
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold font-heading">
                Top Clubs by Members
              </h2>
              <p className="text-sm text-base-content/60 mt-1">
                Active memberships across top 8 clubs
              </p>
            </div>

            <div className="badge badge-primary badge-outline px-4 py-3">
              Top 8
            </div>
          </div>

          {chartLoading ? (
            <LoadingSpinner fullScreen={false} />
          ) : (
            <ResponsiveContainer width="100%" height={380}>
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 20,
                  left: 0,
                  bottom: 70,
                }}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  opacity={0.2}
                />

                <XAxis
                  dataKey="clubName"
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                  tick={{
                    fontSize: 12,
                    fill: "#888",
                  }}
                />

                <YAxis
                  tick={{
                    fontSize: 12,
                    fill: "#888",
                  }}
                />

                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.04)" }}
                  contentStyle={{
                    borderRadius: "14px",
                    border: "none",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  }}
                />

                <Bar
                  dataKey="members"
                  radius={[12, 12, 0, 0]}
                  barSize={42}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        [
                          "#6366F1",
                          "#8B5CF6",
                          "#06B6D4",
                          "#10B981",
                          "#F59E0B",
                          "#EF4444",
                          "#EC4899",
                          "#14B8A6",
                        ][index % 8]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
