import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosInstance";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";

const EventRegistrations = () => {
  const { eventId } = useParams();

  const { data: registrations = [], isLoading } = useQuery({
    queryKey: ["eventRegistrations", eventId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/registrations/event/${eventId}`);
      return res.data;
    },
  });

  if (isLoading) return <LoadingSpinner fullScreen={false} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">Event Registrations</h1>
        <p className="text-base-content/50 text-sm mt-1">{registrations.length} registered</p>
      </div>

      <div className="card bg-base-100 shadow border border-base-300 overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr className="bg-base-200">
              <th>#</th><th>Member</th><th>Email</th><th>Status</th><th>Payment</th><th>Registered</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg, i) => (
              <tr key={reg._id}>
                <td className="text-base-content/40 text-sm">{i + 1}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <img src={reg.userPhoto || `https://ui-avatars.com/api/?name=${reg.userName}&background=6C63FF&color=fff`}
                      alt="" className="w-8 h-8 rounded-full" />
                    <span className="text-sm font-medium">{reg.userName}</span>
                  </div>
                </td>
                <td className="text-sm text-base-content/60">{reg.userEmail}</td>
                <td>
                  <span className={`badge badge-sm ${reg.status === "registered" ? "badge-success" : "badge-error"}`}>
                    {reg.status}
                  </span>
                </td>
                <td className="text-sm text-base-content/50">
                  {reg.paymentId ? <span className="badge badge-primary badge-sm">Paid</span> : "Free"}
                </td>
                <td className="text-sm text-base-content/50">
                  {new Date(reg.registeredAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {registrations.length === 0 && (
          <div className="text-center py-12 text-base-content/40">No registrations yet</div>
        )}
      </div>
    </div>
  );
};

export default EventRegistrations;
