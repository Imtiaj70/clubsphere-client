import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosInstance";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";

const AdminPayments = () => {
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["adminPayments"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/admin/payments");
      return res.data;
    },
  });

  const total = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  if (isLoading) return <LoadingSpinner fullScreen={false} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold font-heading">All Payments</h1>
          <p className="text-base-content/50 text-sm mt-1">{payments.length} transactions</p>
        </div>
        <div className="card bg-primary text-white px-6 py-3 shadow">
          <p className="text-sm opacity-80">Total Revenue</p>
          <p className="text-2xl font-bold font-heading">${total.toFixed(2)}</p>
        </div>
      </div>

      <div className="card bg-base-100 shadow border border-base-300 overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr className="bg-base-200">
              <th>#</th>
              <th>User</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Club</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p, i) => (
              <tr key={p._id}>
                <td className="text-base-content/40 text-sm">{i + 1}</td>
                <td className="text-sm">{p.userEmail}</td>
                <td className="font-semibold text-primary">${p.amount?.toFixed(2)}</td>
                <td>
                  <span className={`badge badge-sm ${p.type === "membership" ? "badge-primary" : "badge-secondary"}`}>
                    {p.type}
                  </span>
                </td>
                <td className="text-sm text-base-content/60">{p.clubName || "—"}</td>
                <td>
                  <span className="badge badge-success badge-sm">{p.status}</span>
                </td>
                <td className="text-sm text-base-content/50">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {payments.length === 0 && (
          <div className="text-center py-12 text-base-content/40">No payments yet</div>
        )}
      </div>
    </div>
  );
};

export default AdminPayments;
