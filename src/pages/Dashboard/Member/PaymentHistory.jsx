import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosInstance";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";

const PaymentHistory = () => {
  const { data: memberships = [], isLoading } = useQuery({
    queryKey: ["myMemberships"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/memberships/my");
      return res.data;
    },
  });

  const paid = memberships.filter((m) => m.paymentId);
  const total = paid.reduce((sum, m) => sum + (m.club?.membershipFee || 0), 0);

  if (isLoading) return <LoadingSpinner fullScreen={false} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold font-heading">Payment History</h1>
          <p className="text-base-content/50 text-sm mt-1">{paid.length} transactions</p>
        </div>
        {paid.length > 0 && (
          <div className="card bg-primary text-white px-6 py-3 shadow">
            <p className="text-sm opacity-80">Total Spent</p>
            <p className="text-2xl font-bold font-heading">${total.toFixed(2)}</p>
          </div>
        )}
      </div>

      {paid.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">💳</p>
          <p className="text-xl font-semibold">No payments yet</p>
          <p className="text-base-content/50 mt-2">Your membership payments will appear here</p>
        </div>
      ) : (
        <div className="card bg-base-100 shadow border border-base-300 overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr className="bg-base-200">
                <th>#</th><th>Club</th><th>Type</th><th>Amount</th><th>Status</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {paid.map((m, i) => (
                <tr key={m._id}>
                  <td className="text-base-content/40 text-sm">{i + 1}</td>
                  <td className="font-medium text-sm">{m.club?.clubName || "—"}</td>
                  <td><span className="badge badge-primary badge-sm">Membership</span></td>
                  <td className="font-semibold text-primary">${m.club?.membershipFee?.toFixed(2) || "—"}</td>
                  <td><span className="badge badge-success badge-sm">Paid</span></td>
                  <td className="text-sm text-base-content/50">
                    {new Date(m.joinedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
